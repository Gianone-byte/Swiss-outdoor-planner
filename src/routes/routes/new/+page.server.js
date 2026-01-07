import { fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

const allowedTypes = ['hike', 'run', 'bike'];
const allowedDifficulties = ['easy', 'medium', 'hard'];

export async function load(event) {
	await requireUser(event);
	return {};
}

export const actions = {
	default: async (event) => {
		await requireUser(event);
		const { request } = event;
		const db = await getDb();
		const formData = await request.formData();

		const values = {
			title: formData.get('title')?.trim() ?? '',
			type: formData.get('type') ?? 'hike',
			region: formData.get('region')?.trim() ?? '',
			distanceKm: formData.get('distanceKm') ? Number(formData.get('distanceKm')) : NaN,
			elevationGain: formData.get('elevationGain')
				? Number(formData.get('elevationGain'))
				: undefined,
			difficulty: formData.get('difficulty') ?? 'medium'
		};

		const errors = {};
		if (!values.title) errors.title = 'Title is required.';
		if (!allowedTypes.includes(values.type)) errors.type = 'Please select a route type.';
		if (!values.region) errors.region = 'Region is required.';
		if (Number.isNaN(values.distanceKm) || values.distanceKm <= 0) {
			errors.distanceKm = 'Distance must be a positive number.';
		}
		if (!allowedDifficulties.includes(values.difficulty)) {
			errors.difficulty = 'Select a difficulty level.';
		}
		if (
			values.elevationGain !== undefined &&
			(Number.isNaN(values.elevationGain) || values.elevationGain < 0)
		) {
			errors.elevationGain = 'Elevation gain must be zero or positive.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const routeDoc = {
			title: values.title,
			type: values.type,
			region: values.region,
			distanceKm: values.distanceKm,
			difficulty: values.difficulty,
			ownerId: new ObjectId(event.locals.user._id),
			createdAt: new Date()
		};

		if (values.elevationGain !== undefined) {
			routeDoc.elevationGain = values.elevationGain;
		}

		const result = await db.collection('routes').insertOne(routeDoc);
		throw redirect(303, `/routes/${result.insertedId.toString()}`);
	}
};
