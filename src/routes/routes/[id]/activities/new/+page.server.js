import { error, fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';

export async function load({ params, cookies }) {
	const role = cookies.get('role') ?? 'user';
	const { id } = params;
	if (!ObjectId.isValid(id)) {
		throw error(404, 'Route not found');
	}

	const db = await getDb();
	const routeDoc = await db.collection('routes').findOne({ _id: new ObjectId(id) });
	if (!routeDoc) {
		throw error(404, 'Route not found');
	}

	return {
		role,
		route: {
			id,
			title: routeDoc.title,
			type: routeDoc.type,
			region: routeDoc.region
		}
	};
}

export const actions = {
	default: async ({ request, params }) => {
		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const formData = await request.formData();

		const values = {
			date: formData.get('date'),
			startTime: formData.get('startTime'),
			durationMinutes: formData.get('durationMinutes')
				? Number(formData.get('durationMinutes'))
				: NaN,
			feeling: formData.get('feeling') ? Number(formData.get('feeling')) : NaN,
			notes: formData.get('notes')?.trim() ?? '',
			imageUrl1: formData.get('imageUrl1')?.trim() ?? '',
			imageUrl2: formData.get('imageUrl2')?.trim() ?? '',
			imageUrl3: formData.get('imageUrl3')?.trim() ?? ''
		};

		const imageUrls = [values.imageUrl1, values.imageUrl2, values.imageUrl3].filter((url) => url);

		const errors = {};
		const dateValue = values.date ? new Date(values.date) : null;
		if (!values.date || Number.isNaN(dateValue?.getTime())) {
			errors.date = 'Provide a valid date.';
		}
		if (!values.startTime) {
			errors.startTime = 'Start time is required.';
		}
		if (Number.isNaN(values.durationMinutes) || values.durationMinutes <= 0) {
			errors.durationMinutes = 'Duration must be positive.';
		}
		if (Number.isNaN(values.feeling) || values.feeling < 1 || values.feeling > 5) {
			errors.feeling = 'Feeling must be between 1 and 5.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const db = await getDb();
		await db.collection('activities').insertOne({
			routeId: new ObjectId(params.id),
			date: dateValue,
			startTime: values.startTime,
			durationMinutes: values.durationMinutes,
			feeling: values.feeling,
			notes: values.notes || undefined,
			imageUrls,
			createdAt: new Date()
		});

		throw redirect(303, `/routes/${params.id}`);
	}
};
