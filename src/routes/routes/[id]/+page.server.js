import { error, fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId, ensureFavoritesIndex } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

const dateFormatter = new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' });
const allowedDifficulties = ['easy', 'medium', 'hard'];

export async function load(event) {
	await requireUser(event);
	const { params } = event;
	const { id } = params;
	const userId = new ObjectId(event.locals.user._id);

	if (!ObjectId.isValid(id)) {
		throw error(404, 'Route not found');
	}

	const db = await getDb();
	const routesCol = db.collection('routes');
	const activitiesCol = db.collection('activities');
	const favoritesCol = db.collection('route_favorites');
	const _id = new ObjectId(id);

	// Ensure favorites index
	await ensureFavoritesIndex();

	const routeDoc = await routesCol.findOne({ _id });
	if (!routeDoc) {
		throw error(404, 'Route not found');
	}
	const isOwner = routeDoc.ownerId ? routeDoc.ownerId.equals(userId) : true;
	const visibility = routeDoc.visibility ?? 'private';

	if (!isOwner && visibility !== 'public') {
		throw redirect(303, '/feed');
	}
	if (!routeDoc.ownerId && isOwner) {
		// Dev convenience: claim legacy routes without ownerId for the current user.
		await routesCol.updateOne({ _id }, { $set: { ownerId: userId } });
	}

	// Check if route is favorited by current user
	const favoriteDoc = await favoritesCol.findOne({ userId, routeId: _id });
	const isFavorited = !!favoriteDoc;

	// Show user's own activities for this route (whether owner or not)
	const activitiesDocs = await activitiesCol
		.find({ routeId: _id, userId })
		.sort({ date: -1, createdAt: -1 })
		.toArray();

	const route = {
		id,
		title: routeDoc.title,
		type: routeDoc.type,
		region: routeDoc.region,
		distanceKm: routeDoc.distanceKm,
		elevationGain: routeDoc.elevationGain,
		difficulty: routeDoc.difficulty,
		swisstopoUrl: routeDoc.swisstopoUrl ?? '',
		gpx: routeDoc.gpx
			? { filename: routeDoc.gpx.filename, mimeType: routeDoc.gpx.mimeType }
			: null,
		visibility,
		createdAt: routeDoc.createdAt ? dateFormatter.format(routeDoc.createdAt) : 'Unknown'
	};

	const activities = activitiesDocs.map((doc) => {
		const base = {
			id: doc._id.toString(),
			routeId: id,
			date: doc.date ? dateFormatter.format(doc.date) : 'No date',
			startTime: doc.startTime ?? '',
			durationMinutes: doc.durationMinutes ?? 0,
			feeling: doc.feeling ?? 0,
			notes: doc.notes ?? '',
			imageUrls: doc.imageUrls ?? []
		};

		// User can always edit their own activities
		return { ...base, editUrl: `/routes/${id}/activities/${doc._id.toString()}/edit` };
	});

	return {
		route,
		activities,
		isOwner,
		isFavorited
	};
}

export const actions = {
	updateRoute: async (event) => {
		await requireUser(event);
		const { request, params } = event;
		const userId = new ObjectId(event.locals.user._id);

		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const formData = await request.formData();
		const distance = formData.get('distanceKm') ? Number(formData.get('distanceKm')) : NaN;
		const difficulty = formData.get('difficulty') ?? '';

		const errors = {};
		if (Number.isNaN(distance) || distance <= 0) {
			errors.distanceKm = 'Provide a positive distance.';
		}
		if (!allowedDifficulties.includes(difficulty)) {
			errors.difficulty = 'Select a difficulty.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				action: 'updateRoute',
				errors,
				values: { distanceKm: formData.get('distanceKm'), difficulty }
			});
		}

		const db = await getDb();
		const routesCol = db.collection('routes');
		const _id = new ObjectId(params.id);
		const routeDoc = await routesCol.findOne({ _id });
		if (!routeDoc || (routeDoc.ownerId && !routeDoc.ownerId.equals(userId))) {
			return fail(403, { action: 'updateRoute', message: 'Not authorized.' });
		}

		await routesCol.updateOne(
			{ _id },
			{
				$set: {
					distanceKm: distance,
					difficulty,
					...(routeDoc.ownerId ? {} : { ownerId: userId })
				}
			}
		);

		throw redirect(303, `/routes/${params.id}`);
	},

	deleteRoute: async (event) => {
		await requireUser(event);
		const { params } = event;
		const userId = new ObjectId(event.locals.user._id);
		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const db = await getDb();
		const _id = new ObjectId(params.id);
		const routesCol = db.collection('routes');
		const routeDoc = await routesCol.findOne({ _id });
		if (!routeDoc || (routeDoc.ownerId && !routeDoc.ownerId.equals(userId))) {
			return fail(403, { message: 'Only the owner can delete routes.' });
		}
		await routesCol.deleteOne({ _id });
		await db.collection('activities').deleteMany({
			routeId: _id,
			$or: [{ userId }, { userId: { $exists: false } }]
		});

		throw redirect(303, '/routes');
	},

	deleteActivity: async (event) => {
		await requireUser(event);
		const { request, params } = event;
		const userId = new ObjectId(event.locals.user._id);
		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const formData = await request.formData();
		const activityId = formData.get('activityId');
		if (!activityId || !ObjectId.isValid(activityId)) {
			return fail(400, { message: 'Invalid activity id.' });
		}

		const db = await getDb();
		const _id = new ObjectId(activityId);
		const routeId = new ObjectId(params.id);

		const activity = await db.collection('activities').findOne({ _id, routeId });
		if (!activity || (activity.userId && !activity.userId.equals(userId))) {
			return fail(403, { message: 'Only the owner can delete activities.' });
		}

		await db.collection('activities').deleteOne({
			_id,
			routeId,
			$or: [{ userId }, { userId: { $exists: false } }]
		});

		throw redirect(303, `/routes/${params.id}`);
	},

	addFavorite: async (event) => {
		await requireUser(event);
		const { params } = event;
		const userId = new ObjectId(event.locals.user._id);

		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const db = await getDb();
		const routesCol = db.collection('routes');
		const favoritesCol = db.collection('route_favorites');
		const _id = new ObjectId(params.id);

		// Check route exists and is public
		const routeDoc = await routesCol.findOne({ _id });
		if (!routeDoc) {
			throw error(404, 'Route not found');
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
		const { params } = event;
		const userId = new ObjectId(event.locals.user._id);

		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const db = await getDb();
		const favoritesCol = db.collection('route_favorites');
		const _id = new ObjectId(params.id);

		await favoritesCol.deleteOne({ userId, routeId: _id });

		return { success: true, action: 'removeFavorite' };
	}
};
