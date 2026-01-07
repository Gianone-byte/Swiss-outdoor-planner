import { error, fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

const dateFormatter = new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' });
const allowedDifficulties = ['easy', 'medium', 'hard'];

export async function load(event) {
	await requireUser(event);
	const { params } = event;
	const { id } = params;

	if (!ObjectId.isValid(id)) {
		throw error(404, 'Route not found');
	}

	const db = await getDb();
	const routesCol = db.collection('routes');
	const activitiesCol = db.collection('activities');
	const _id = new ObjectId(id);

	const routeDoc = await routesCol.findOne({ _id });
	if (!routeDoc) {
		throw error(404, 'Route not found');
	}

	const activitiesDocs = await activitiesCol
		.find({ routeId: _id })
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
		createdAt: routeDoc.createdAt ? dateFormatter.format(routeDoc.createdAt) : 'Unknown'
	};

	const activities = activitiesDocs.map((doc) => ({
		id: doc._id.toString(),
		routeId: id,
		date: doc.date ? dateFormatter.format(doc.date) : 'No date',
		startTime: doc.startTime ?? '',
		durationMinutes: doc.durationMinutes ?? 0,
		feeling: doc.feeling ?? 0,
		notes: doc.notes ?? '',
		imageUrls: doc.imageUrls ?? [],
		editUrl: `/routes/${id}/activities/${doc._id.toString()}/edit`
	}));

	return {
		route,
		activities
	};
}

export const actions = {
	updateRoute: async (event) => {
		await requireUser(event);
		const { request, params } = event;

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
		await db
			.collection('routes')
			.updateOne(
				{ _id: new ObjectId(params.id) },
				{ $set: { distanceKm: distance, difficulty } }
			);

		throw redirect(303, `/routes/${params.id}`);
	},

	deleteRoute: async (event) => {
		await requireUser(event);
		const { params } = event;
		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const db = await getDb();
		const _id = new ObjectId(params.id);
		await db.collection('routes').deleteOne({ _id });
		await db.collection('activities').deleteMany({ routeId: _id });

		throw redirect(303, '/routes');
	},

	deleteActivity: async (event) => {
		await requireUser(event);
		const { request, params } = event;
		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const formData = await request.formData();
		const activityId = formData.get('activityId');
		if (!activityId || !ObjectId.isValid(activityId)) {
			return fail(400, { message: 'Invalid activity id.' });
		}

		const db = await getDb();
		await db
			.collection('activities')
			.deleteOne({ _id: new ObjectId(activityId), routeId: new ObjectId(params.id) });

		throw redirect(303, `/routes/${params.id}`);
	}
};
