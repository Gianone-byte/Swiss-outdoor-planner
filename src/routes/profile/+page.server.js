import { fail } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

export async function load(event) {
	await requireUser(event);
	const db = await getDb();
	const userId = new ObjectId(event.locals.user._id);

	// Get user data
	const usersCol = db.collection('users');
	const userDoc = await usersCol.findOne({ _id: userId });

	const activitiesCol = db.collection('activities');
	const routesCol = db.collection('routes');

	const activityDocs = await activitiesCol.find({ userId }).toArray();
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
		stats,
		profile: {
			email: userDoc?.email ?? event.locals.user.email,
			username: userDoc?.username ?? '',
			avatarUrl: userDoc?.avatarUrl ?? ''
		}
	};
}

export const actions = {
	updateProfile: async (event) => {
		await requireUser(event);
		const { request } = event;
		const userId = new ObjectId(event.locals.user._id);

		const formData = await request.formData();
		const username = formData.get('username')?.trim() ?? '';
		const avatarUrl = formData.get('avatarUrl')?.trim() ?? '';

		const errors = {};

		// Validate username
		if (username && (username.length < 3 || username.length > 30)) {
			errors.username = 'Username muss zwischen 3 und 30 Zeichen lang sein.';
		}

		// Validate avatarUrl
		if (avatarUrl && !avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
			errors.avatarUrl = 'Avatar URL muss mit http:// oder https:// beginnen.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				values: { username, avatarUrl }
			});
		}

		const db = await getDb();
		const usersCol = db.collection('users');

		await usersCol.updateOne(
			{ _id: userId },
			{
				$set: {
					username: username || null,
					avatarUrl: avatarUrl || null,
					updatedAt: new Date()
				}
			}
		);

		return { success: true };
	}
};
