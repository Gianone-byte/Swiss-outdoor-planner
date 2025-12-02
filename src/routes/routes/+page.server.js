import { fail } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';

const allowedTypes = ['all', 'hike', 'run', 'bike'];

export async function load({ cookies, url }) {
	const role = cookies.get('role') ?? 'user';
	const inputType = url.searchParams.get('type') ?? 'all';
	const typeParam = allowedTypes.includes(inputType) ? inputType : 'all';
	const db = await getDb();
	const routesCol = db.collection('routes');

	const filter = typeParam === 'all' ? {} : { type: typeParam };
	const routesDocs = await routesCol.find(filter).sort({ createdAt: -1 }).toArray();

	const routes = routesDocs.map((route) => ({
		id: route._id.toString(),
		title: route.title,
		type: route.type,
		region: route.region,
		distanceKm: route.distanceKm,
		difficulty: route.difficulty
	}));

	return { role, routes, currentType: typeParam };
}

export const actions = {
	deleteRoute: async ({ request, cookies }) => {
		const role = cookies.get('role') ?? 'user';
		if (role !== 'admin') {
			return fail(403, { message: 'You are not allowed to delete routes.' });
		}

		const formData = await request.formData();
		const routeId = formData.get('routeId');
		if (!routeId) {
			return fail(400, { message: 'Missing route id.' });
		}

		const db = await getDb();
		const routesCol = db.collection('routes');
		const activitiesCol = db.collection('activities');
		const _id = new ObjectId(routeId);

		await routesCol.deleteOne({ _id });
		await activitiesCol.deleteMany({ routeId: _id });

		return { deleted: true };
	}
};
