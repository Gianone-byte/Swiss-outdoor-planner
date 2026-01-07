import { fail } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';
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

	const filter = {
		...(typeParam === 'all' ? {} : { type: typeParam }),
		$or: [{ ownerId: userId }, { ownerId: { $exists: false } }]
	};
	const routesDocs = await routesCol.find(filter).sort({ createdAt: -1 }).toArray();

	const legacyRouteIds = routesDocs.filter((route) => !route.ownerId).map((route) => route._id);
	if (legacyRouteIds.length) {
		// Dev convenience: claim legacy routes without ownerId for the current user.
		await routesCol.updateMany(
			{ _id: { $in: legacyRouteIds } },
			{ $set: { ownerId: userId } }
		);
	}

	const routes = routesDocs.map((route) => ({
		id: route._id.toString(),
		title: route.title,
		type: route.type,
		region: route.region,
		distanceKm: route.distanceKm,
		difficulty: route.difficulty
	}));

	return { routes, currentType: typeParam };
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
	}
};
