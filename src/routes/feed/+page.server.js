import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';
import { parseGpxPoints } from '$lib/server/gpxParser';
import { Buffer } from 'node:buffer';

const dateFormatter = new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' });

export async function load(event) {
	await requireUser(event);
	const db = await getDb();
	const userId = new ObjectId(event.locals.user._id);

	const activitiesCol = db.collection('activities');
	const routesCol = db.collection('routes');
	const usersCol = db.collection('users');

	const currentUser = await usersCol.findOne({ _id: userId });
	
	const userActivityDocs = await activitiesCol.find({ userId }).toArray();
	const userRouteIds = [...new Set(userActivityDocs.map((a) => a.routeId?.toString()).filter(Boolean))];
	let userRouteMap = new Map();
	if (userRouteIds.length) {
		const userRouteDocs = await routesCol
			.find({ _id: { $in: userRouteIds.map((id) => new ObjectId(id)) } })
			.toArray();
		userRouteMap = new Map(userRouteDocs.map((route) => [route._id.toString(), route]));
	}

	const userStats = {
		totalActivities: userActivityDocs.length,
		distanceByType: { hike: 0, run: 0, bike: 0 },
		durationByType: { hike: 0, run: 0, bike: 0 }
	};

	for (const activity of userActivityDocs) {
		const route = userRouteMap.get(activity.routeId?.toString());
		if (route && typeof route.distanceKm === 'number') {
			userStats.distanceByType[route.type] = (userStats.distanceByType[route.type] || 0) + route.distanceKm;
		}
		if (route) {
			userStats.durationByType[route.type] = (userStats.durationByType[route.type] || 0) + (activity.durationMinutes ?? 0);
		}
	}

	const activityDocs = await activitiesCol
		.find({})
		.sort({ createdAt: -1 })
		.limit(20)
		.toArray();

	const routeIds = [...new Set(activityDocs.map((a) => a.routeId?.toString()).filter(Boolean))];
	const userIds = [...new Set(activityDocs.map((a) => a.userId?.toString()).filter(Boolean))];

	let routeMap = new Map();
	if (routeIds.length) {
		const routeDocs = await routesCol
			.find({ _id: { $in: routeIds.map((id) => new ObjectId(id)) } })
			.toArray();
		routeMap = new Map(routeDocs.map((route) => [route._id.toString(), route]));
	}

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

		const canViewRoute = route
			? route.visibility === 'public' || (route.ownerId && route.ownerId.equals(userId))
			: false;

		const hasGpx = !!(route?.gpx?.contentBase64);
		let gpxPreview = null;
		if (hasGpx && canViewRoute) {
			try {
				const gpxXml = Buffer.from(route.gpx.contentBase64, 'base64').toString('utf-8');
				gpxPreview = parseGpxPoints(gpxXml, 300);
			} catch (err) {
				console.error('Error parsing GPX for feed:', err);
			}
		}

		return {
			id: doc._id.toString(),
			routeId: doc.routeId?.toString(),
			routeTitle: route?.title ?? 'Unknown route',
			routeType: route?.type ?? 'unknown',
			routeKanton: route?.kanton || route?.region || '',
			routeOrt: route?.ort || '',
			routeDistanceKm: route?.distanceKm ?? 0,
			hasGpx,
			gpxPreview,
			canViewRoute,
			date: doc.date ? dateFormatter.format(doc.date) : 'No date',
			startTime: doc.startTime ?? '',
			durationMinutes: doc.durationMinutes ?? 0,
			feeling: doc.feeling ?? 0,
			notes: doc.notes ?? '',
			imageUrls: doc.imageUrls ?? [],
			user: {
				username: activityUser?.username ?? null,
				avatarUrl: activityUser?.avatarUrl ?? null,
				email: activityUser?.email ?? 'Unknown'
			}
		};
	});

	return { 
		activities,
		currentUser: {
			username: currentUser?.username ?? null,
			avatarUrl: currentUser?.avatarUrl ?? null,
			email: currentUser?.email ?? event.locals.user.email
		},
		userStats
	};
}
