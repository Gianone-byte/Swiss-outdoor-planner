import { requireUser } from '$lib/server/auth';
import { getDb, ObjectId } from '$lib/server/db';
import { Buffer } from 'node:buffer';

export async function GET(event) {
	await requireUser(event);
	const { params } = event;

	if (!ObjectId.isValid(params.id)) {
		return new Response('Not found', { status: 404 });
	}

	const db = await getDb();
	const routesCol = db.collection('routes');
	const _id = new ObjectId(params.id);
	const userId = new ObjectId(event.locals.user._id);
	const routeDoc = await routesCol.findOne({ _id });

	if (!routeDoc) {
		return new Response('Not found', { status: 404 });
	}

	const isOwner = routeDoc.ownerId ? routeDoc.ownerId.equals(userId) : true;
	const visibility = routeDoc.visibility ?? 'private';

	if (!isOwner && visibility !== 'public') {
		return new Response('Forbidden', { status: 403 });
	}

	if (!routeDoc.ownerId && isOwner) {
		// Dev convenience: claim legacy routes without ownerId for the current user.
		await routesCol.updateOne({ _id }, { $set: { ownerId: userId } });
	}

	if (!routeDoc.gpx) {
		return new Response('Not found', { status: 404 });
	}

	const filename = (routeDoc.gpx.filename || 'route.gpx').replace(/"/g, '');
	const mimeType = routeDoc.gpx.mimeType || 'application/gpx+xml';
	const fileBuffer = Buffer.from(routeDoc.gpx.contentBase64, 'base64');

	return new Response(fileBuffer, {
		headers: {
			'Content-Type': mimeType,
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
}
