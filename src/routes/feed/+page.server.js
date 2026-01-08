import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

const dateFormatter = new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' });

export async function load(event) {
	await requireUser(event);
	const db = await getDb();
	const userId = new ObjectId(event.locals.user._id);

	const activitiesCol = db.collection('activities');
	const routesCol = db.collection('routes');
	const usersCol = db.collection('users');

	// Get last 20 activities from all users
	const activityDocs = await activitiesCol
		.find({})
		.sort({ createdAt: -1 })
		.limit(20)
		.toArray();

	// Collect unique route IDs and user IDs
	const routeIds = [...new Set(activityDocs.map((a) => a.routeId?.toString()).filter(Boolean))];
	const userIds = [...new Set(activityDocs.map((a) => a.userId?.toString()).filter(Boolean))];

	// Fetch routes
	let routeMap = new Map();
	if (routeIds.length) {
		const routeDocs = await routesCol
			.find({ _id: { $in: routeIds.map((id) => new ObjectId(id)) } })
			.toArray();
		routeMap = new Map(routeDocs.map((route) => [route._id.toString(), route]));
	}

	// Fetch users
	let userMap = new Map();
	if (userIds.length) {
		const userDocs = await usersCol
			.find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
			.toArray();
		userMap = new Map(userDocs.map((user) => [user._id.toString(), user]));
	}

	const activities = activityDocs.map((doc) => {
		const route = doc.routeId ? routeMap.get(doc.routeId.toString()) : null;
		const activityUser = doc.userId ? userMap.get(doc.userId.toString()) : null;

		// Can view route if public OR if current user is owner
		const canViewRoute = route
			? route.visibility === 'public' || (route.ownerId && route.ownerId.equals(userId))
			: false;

		return {
			id: doc._id.toString(),
			routeId: doc.routeId?.toString(),
			routeTitle: route?.title ?? 'Unknown route',
			routeType: route?.type ?? 'unknown',
			routeRegion: route?.region ?? '',
			routeDistanceKm: route?.distanceKm ?? 0,
			canViewRoute,
			date: doc.date ? dateFormatter.format(doc.date) : 'No date',
			startTime: doc.startTime ?? '',
			durationMinutes: doc.durationMinutes ?? 0,
			feeling: doc.feeling ?? 0,
			notes: doc.notes ?? '',
			imageUrls: doc.imageUrls ?? [],
			// User info
			user: {
				username: activityUser?.username ?? null,
				avatarUrl: activityUser?.avatarUrl ?? null,
				email: activityUser?.email ?? 'Unknown'
			}
		};
	});

	return { activities };
}
