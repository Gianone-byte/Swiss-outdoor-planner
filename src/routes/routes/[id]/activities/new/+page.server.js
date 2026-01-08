import { error, fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

export async function load(event) {
	await requireUser(event);
	const { params } = event;
	const { id } = params;
	const userId = new ObjectId(event.locals.user._id);
	if (!ObjectId.isValid(id)) {
		throw error(404, 'Route not found');
	}

	const db = await getDb();
	const routesCol = db.collection('routes');
	const favoritesCol = db.collection('route_favorites');
	const routeId = new ObjectId(id);
	const routeDoc = await routesCol.findOne({ _id: routeId });
	if (!routeDoc) {
		throw error(404, 'Route not found');
	}

	const isOwner = routeDoc.ownerId ? routeDoc.ownerId.equals(userId) : true;
	const visibility = routeDoc.visibility ?? 'private';

	// Allow access if owner OR if route is public and favorited by user
	if (!isOwner) {
		if (visibility !== 'public') {
			throw redirect(303, '/feed');
		}
		const favoriteDoc = await favoritesCol.findOne({ userId, routeId });
		if (!favoriteDoc) {
			throw redirect(303, '/feed');
		}
	}

	if (!routeDoc.ownerId && isOwner) {
		// Dev convenience: claim legacy routes without ownerId for the current user.
		await routesCol.updateOne({ _id: routeId }, { $set: { ownerId: userId } });
	}

	return {
		route: {
			id,
			title: routeDoc.title,
			type: routeDoc.type,
			region: routeDoc.region
		}
	};
}

export const actions = {
	default: async (event) => {
		await requireUser(event);
		const { request, params } = event;
		const userId = new ObjectId(event.locals.user._id);
		if (!ObjectId.isValid(params.id)) {
			throw error(404, 'Route not found');
		}

		const db = await getDb();
		const routesCol = db.collection('routes');
		const favoritesCol = db.collection('route_favorites');
		const routeId = new ObjectId(params.id);
		const routeDoc = await routesCol.findOne({ _id: routeId });
		if (!routeDoc) {
			return fail(404, { message: 'Route not found.' });
		}

		const isOwner = routeDoc.ownerId ? routeDoc.ownerId.equals(userId) : true;
		const visibility = routeDoc.visibility ?? 'private';

		// Allow if owner OR if route is public and favorited by user
		if (!isOwner) {
			if (visibility !== 'public') {
				return fail(403, { message: 'Not authorized to log activity for this route.' });
			}
			const favoriteDoc = await favoritesCol.findOne({ userId, routeId });
			if (!favoriteDoc) {
				return fail(403, { message: 'You must save this route to your favorites first.' });
			}
		}

		if (!routeDoc.ownerId && isOwner) {
			// Dev convenience: claim legacy routes without ownerId for the current user.
			await routesCol.updateOne({ _id: routeId }, { $set: { ownerId: userId } });
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

		await db.collection('activities').insertOne({
			routeId,
			userId,
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
