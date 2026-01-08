import { fail } from '@sveltejs/kit';
import { getDb, ObjectId, ensureFavoritesIndex } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

const allowedTypes = ['all', 'hike', 'run', 'bike'];

export async function load(event) {
	await requireUser(event);
	const { url } = event;
	const inputType = url.searchParams.get('type') ?? 'all';
	const typeParam = allowedTypes.includes(inputType) ? inputType : 'all';
	const userId = new ObjectId(event.locals.user._id);
	const db = await getDb();
	const routesCol = db.collection('routes');
	const favoritesCol = db.collection('route_favorites');

	// Ensure unique index on favorites
	await ensureFavoritesIndex();

	const typeFilter = typeParam === 'all' ? {} : { type: typeParam };
	const myRoutesFilter = {
		...typeFilter,
		$or: [{ ownerId: userId }, { ownerId: { $exists: false } }]
	};
	const publicRoutesFilter = {
		...typeFilter,
		visibility: 'public',
		ownerId: { $ne: userId, $exists: true }
	};

	// Get user's favorites
	const userFavorites = await favoritesCol.find({ userId }).toArray();
	const favoriteRouteIds = userFavorites.map((f) => f.routeId);

	const [myRoutesDocs, publicRoutesDocs] = await Promise.all([
		routesCol.find(myRoutesFilter).sort({ createdAt: -1 }).toArray(),
		routesCol.find(publicRoutesFilter).sort({ createdAt: -1 }).toArray()
	]);

	// Get favorited routes that are still public (and not owned by user)
	const favoritedRoutesDocs = await routesCol
		.find({
			_id: { $in: favoriteRouteIds },
			visibility: 'public',
			ownerId: { $ne: userId, $exists: true }
		})
		.sort({ createdAt: -1 })
		.toArray();

	const legacyRouteIds = myRoutesDocs.filter((route) => !route.ownerId).map((route) => route._id);
	if (legacyRouteIds.length) {
		// Dev convenience: claim legacy routes without ownerId for the current user.
		await routesCol.updateMany(
			{ _id: { $in: legacyRouteIds } },
			{ $set: { ownerId: userId } }
		);
	}

	const mapRoute = (route, isFavorited = false) => ({
		id: route._id.toString(),
		title: route.title,
		type: route.type,
		region: route.region,
		distanceKm: route.distanceKm,
		difficulty: route.difficulty,
		isFavorited
	});

	// Mark public routes as favorited if they are
	const favoriteIdSet = new Set(favoriteRouteIds.map((id) => id.toString()));
	const publicRoutesWithFavorites = publicRoutesDocs.map((route) =>
		mapRoute(route, favoriteIdSet.has(route._id.toString()))
	);

	return {
		myRoutes: myRoutesDocs.map((r) => mapRoute(r)),
		publicRoutes: publicRoutesWithFavorites,
		favoritedRoutes: favoritedRoutesDocs.map((r) => mapRoute(r, true)),
		currentType: typeParam
	};
}

export const actions = {
	deleteRoute: async (event) => {
		await requireUser(event);
		const { request } = event;

		const formData = await request.formData();
		const routeId = formData.get('routeId');
		if (!routeId) {
			return fail(400, { message: 'Missing route id.' });
		}

		const db = await getDb();
		const routesCol = db.collection('routes');
		const activitiesCol = db.collection('activities');
		const _id = new ObjectId(routeId);
		const userId = new ObjectId(event.locals.user._id);

		const routeDoc = await routesCol.findOne({ _id });
		if (!routeDoc || (routeDoc.ownerId && !routeDoc.ownerId.equals(userId))) {
			return fail(403, { message: 'You are not allowed to delete routes.' });
		}

		await routesCol.deleteOne({ _id });
		await activitiesCol.deleteMany({
			routeId: _id,
			$or: [{ userId }, { userId: { $exists: false } }]
		});

		return { deleted: true };
	},

	addFavorite: async (event) => {
		await requireUser(event);
		const { request } = event;
		const formData = await request.formData();
		const routeId = formData.get('routeId');

		if (!routeId || !ObjectId.isValid(routeId)) {
			return fail(400, { message: 'Invalid route id.' });
		}

		const db = await getDb();
		const routesCol = db.collection('routes');
		const favoritesCol = db.collection('route_favorites');
		const _id = new ObjectId(routeId);
		const userId = new ObjectId(event.locals.user._id);

		// Check route exists and is public
		const routeDoc = await routesCol.findOne({ _id });
		if (!routeDoc) {
			return fail(404, { message: 'Route not found.' });
		}
		if (routeDoc.visibility !== 'public') {
			return fail(403, { message: 'Only public routes can be favorited.' });
		}
		// Prevent favoriting own routes
		if (routeDoc.ownerId && routeDoc.ownerId.equals(userId)) {
			return fail(400, { message: 'Cannot favorite your own routes.' });
		}

		try {
			await favoritesCol.insertOne({
				userId,
				routeId: _id,
				createdAt: new Date()
			});
		} catch (err) {
			// Duplicate key error (already favorited)
			if (err.code === 11000) {
				return { success: true, action: 'addFavorite', alreadyFavorited: true };
			}
			throw err;
		}

		return { success: true, action: 'addFavorite' };
	},

	removeFavorite: async (event) => {
		await requireUser(event);
		const { request } = event;
		const formData = await request.formData();
		const routeId = formData.get('routeId');

		if (!routeId || !ObjectId.isValid(routeId)) {
			return fail(400, { message: 'Invalid route id.' });
		}

		const db = await getDb();
		const favoritesCol = db.collection('route_favorites');
		const _id = new ObjectId(routeId);
		const userId = new ObjectId(event.locals.user._id);

		await favoritesCol.deleteOne({ userId, routeId: _id });

		return { success: true, action: 'removeFavorite' };
	}
};
