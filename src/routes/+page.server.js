import { getDb, ObjectId } from '$lib/server/db';

const dateFormatter = new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' });

function mapActivity(doc, routeMap) {
	const route = doc.routeId ? routeMap.get(doc.routeId.toString()) : null;
	return {
		id: doc._id.toString(),
		routeId: doc.routeId?.toString(),
		routeTitle: route?.title ?? 'Unknown route',
		routeType: route?.type ?? 'unknown',
		date: doc.date ? dateFormatter.format(doc.date) : 'No date',
		startTime: doc.startTime ?? '',
		durationMinutes: doc.durationMinutes ?? 0,
		feeling: doc.feeling ?? 0,
		notes: doc.notes ?? '',
		imageUrls: doc.imageUrls ?? []
	};
}

export async function load({ cookies }) {
	const role = cookies.get('role') ?? 'user';
	const db = await getDb();

	const activitiesCol = db.collection('activities');
	const routesCol = db.collection('routes');

	const recentActivitiesDocs = await activitiesCol.find({}).sort({ date: -1, createdAt: -1 }).limit(3).toArray();
	const routeIds = [...new Set(recentActivitiesDocs.map((activity) => activity.routeId?.toString()).filter(Boolean))];

	let routeMap = new Map();
	if (routeIds.length) {
		const routeDocs = await routesCol
			.find({ _id: { $in: routeIds.map((id) => new ObjectId(id)) } })
			.toArray();
		routeMap = new Map(routeDocs.map((route) => [route._id.toString(), route]));
	}

	return {
		role,
		recentActivities: recentActivitiesDocs.map((doc) => mapActivity(doc, routeMap))
	};
}
