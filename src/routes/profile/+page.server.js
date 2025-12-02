import { getDb, ObjectId } from '$lib/server/db';

export async function load({ cookies }) {
	const role = cookies.get('role') ?? 'user';
	const db = await getDb();

	const activitiesCol = db.collection('activities');
	const routesCol = db.collection('routes');

	const activityDocs = await activitiesCol.find({}).toArray();
	const routeIds = [...new Set(activityDocs.map((activity) => activity.routeId?.toString()).filter(Boolean))];
	let routeMap = new Map();

	if (routeIds.length) {
		const routeDocs = await routesCol
			.find({ _id: { $in: routeIds.map((id) => new ObjectId(id)) } })
			.toArray();
		routeMap = new Map(routeDocs.map((route) => [route._id.toString(), route]));
	}

	const stats = {
		totalActivities: activityDocs.length,
		distanceByType: { hike: 0, run: 0, bike: 0 },
		durationByType: { hike: 0, run: 0, bike: 0 },
		activitiesWithImages: 0,
		activitiesWithoutImages: 0
	};

	for (const activity of activityDocs) {
		const route = routeMap.get(activity.routeId?.toString());
		if (route && typeof route.distanceKm === 'number') {
			stats.distanceByType[route.type] += route.distanceKm;
		}
		if (route) {
			stats.durationByType[route.type] += activity.durationMinutes ?? 0;
		}
		if (activity.imageUrls?.length) {
			stats.activitiesWithImages += 1;
		} else {
			stats.activitiesWithoutImages += 1;
		}
	}

	return {
		role,
		stats
	};
}
