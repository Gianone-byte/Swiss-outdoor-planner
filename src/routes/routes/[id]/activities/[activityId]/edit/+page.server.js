import { error, fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';

function formatDateInput(value) {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return date.toISOString().split('T')[0];
}

export async function load({ params, cookies }) {
	const role = cookies.get('role') ?? 'user';
	const { id, activityId } = params;

	if (!ObjectId.isValid(id) || !ObjectId.isValid(activityId)) {
		throw error(404, 'Activity not found');
	}

	const db = await getDb();
	const routesCol = db.collection('routes');
	const activitiesCol = db.collection('activities');

	const routeDoc = await routesCol.findOne({ _id: new ObjectId(id) });
	if (!routeDoc) {
		throw error(404, 'Route not found');
	}

	const activityDoc = await activitiesCol.findOne({
		_id: new ObjectId(activityId),
		routeId: new ObjectId(id)
	});

	if (!activityDoc) {
		throw error(404, 'Activity not found');
	}

	return {
		role,
		route: {
			id,
			title: routeDoc.title
		},
		activity: {
			id: activityId,
			date: formatDateInput(activityDoc.date),
			startTime: activityDoc.startTime ?? '',
			durationMinutes: activityDoc.durationMinutes ?? '',
			feeling: activityDoc.feeling?.toString() ?? '3',
			notes: activityDoc.notes ?? '',
			imageUrl1: activityDoc.imageUrls?.[0] ?? '',
			imageUrl2: activityDoc.imageUrls?.[1] ?? '',
			imageUrl3: activityDoc.imageUrls?.[2] ?? ''
		}
	};
}

export const actions = {
	default: async ({ request, params }) => {
		const { id, activityId } = params;
		if (!ObjectId.isValid(id) || !ObjectId.isValid(activityId)) {
			throw error(404, 'Activity not found');
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

		const imageUrls = [values.imageUrl1, values.imageUrl2, values.imageUrl3].filter((url) => url);

		const db = await getDb();
		await db.collection('activities').updateOne(
			{ _id: new ObjectId(activityId), routeId: new ObjectId(id) },
			{
				$set: {
					date: dateValue,
					startTime: values.startTime,
					durationMinutes: values.durationMinutes,
					feeling: values.feeling,
					notes: values.notes || undefined,
					imageUrls
				}
			}
		);

		throw redirect(303, `/routes/${id}`);
	}
};
