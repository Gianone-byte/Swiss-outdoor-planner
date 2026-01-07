import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

const dateFormatter = new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' });
const allowedTypes = ['all', 'hike', 'run', 'bike'];

export async function load(event) {
	await requireUser(event);
	const { url } = event;
	const typeParam = url.searchParams.get('type') ?? 'all';
	const typeFilter = allowedTypes.includes(typeParam) ? typeParam : 'all';

	const db = await getDb();
	const activitiesCol = db.collection('activities');
	const routesCol = db.collection('routes');

	const activitiesDocs = await activitiesCol.find({}).sort({ date: -1, createdAt: -1 }).toArray();
	const routeIds = [...new Set(activitiesDocs.map((activity) => activity.routeId?.toString()).filter(Boolean))];
	let routeMap = new Map();

	if (routeIds.length) {
		const routes = await routesCol
			.find({ _id: { $in: routeIds.map((id) => new ObjectId(id)) } })
			.toArray();
		routeMap = new Map(routes.map((route) => [route._id.toString(), route]));
	}

	const activities = activitiesDocs
		.map((doc) => {
			const route = routeMap.get(doc.routeId?.toString());
			return {
				id: doc._id.toString(),
				routeId: doc.routeId?.toString(),
				routeTitle: route?.title ?? 'Unknown route',
				routeType: route?.type ?? 'unknown',
				date: doc.date ? dateFormatter.format(doc.date) : 'No date',
				startTime: doc.startTime ?? '',
				durationMinutes: doc.durationMinutes ?? 0,
				feeling: doc.feeling ?? 0,
				imageUrls: doc.imageUrls ?? []
			};
		})
		.filter((activity) => (typeFilter === 'all' ? true : activity.routeType === typeFilter));

	return {
		activities,
		typeFilter
	};
}
