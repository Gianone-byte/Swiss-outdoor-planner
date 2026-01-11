import { getDb, ObjectId } from '$lib/server/db';
import { Buffer } from 'node:buffer';

const MAX_POINTS = 1500;

function parseGpxCoordinates(gpxXml) {
	const points = [];

	const trkptRegex = /<trkpt\s+[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*\/?>/gi;
	const trkptRegexAlt = /<trkpt\s+[^>]*lon=["']([^"']+)["'][^>]*lat=["']([^"']+)["'][^>]*\/?>/gi;

	let match;
	while ((match = trkptRegex.exec(gpxXml)) !== null) {
		const lat = parseFloat(match[1]);
		const lng = parseFloat(match[2]);
		if (!isNaN(lat) && !isNaN(lng)) {
			points.push([lat, lng]);
		}
	}

	if (points.length === 0) {
		while ((match = trkptRegexAlt.exec(gpxXml)) !== null) {
			const lng = parseFloat(match[1]);
			const lat = parseFloat(match[2]);
			if (!isNaN(lat) && !isNaN(lng)) {
				points.push([lat, lng]);
			}
		}
	}

	if (points.length === 0) {
		const rteptRegex = /<rtept\s+[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*\/?>/gi;
		const rteptRegexAlt = /<rtept\s+[^>]*lon=["']([^"']+)["'][^>]*lat=["']([^"']+)["'][^>]*\/?>/gi;

		while ((match = rteptRegex.exec(gpxXml)) !== null) {
			const lat = parseFloat(match[1]);
			const lng = parseFloat(match[2]);
			if (!isNaN(lat) && !isNaN(lng)) {
				points.push([lat, lng]);
			}
		}

		if (points.length === 0) {
			while ((match = rteptRegexAlt.exec(gpxXml)) !== null) {
				const lng = parseFloat(match[1]);
				const lat = parseFloat(match[2]);
				if (!isNaN(lat) && !isNaN(lng)) {
					points.push([lat, lng]);
				}
			}
		}
	}

	return points;
}

function reducePoints(points, maxPoints) {
	if (points.length <= maxPoints) {
		return points;
	}

	const step = Math.ceil(points.length / maxPoints);
	const reduced = [];

	for (let i = 0; i < points.length; i += step) {
		reduced.push(points[i]);
	}

	const lastPoint = points[points.length - 1];
	const lastReduced = reduced[reduced.length - 1];
	if (lastPoint[0] !== lastReduced[0] || lastPoint[1] !== lastReduced[1]) {
		reduced.push(lastPoint);
	}

	return reduced;
}

function calculateBoundingBox(points) {
	if (points.length === 0) {
		return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };
	}

	let minLat = points[0][0];
	let maxLat = points[0][0];
	let minLng = points[0][1];
	let maxLng = points[0][1];

	for (const [lat, lng] of points) {
		if (lat < minLat) minLat = lat;
		if (lat > maxLat) maxLat = lat;
		if (lng < minLng) minLng = lng;
		if (lng > maxLng) maxLng = lng;
	}

	return { minLat, maxLat, minLng, maxLng };
}

export async function GET(event) {
	const { params, locals } = event;

	if (!ObjectId.isValid(params.id)) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const db = await getDb();
	const routesCol = db.collection('routes');
	const _id = new ObjectId(params.id);
	const routeDoc = await routesCol.findOne({ _id });

	if (!routeDoc) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const visibility = routeDoc.visibility ?? 'private';
	const isPublic = visibility === 'public';
	const userId = locals.user?._id ? new ObjectId(locals.user._id) : null;
	const isOwner = userId && routeDoc.ownerId ? routeDoc.ownerId.equals(userId) : false;

	if (!isPublic && !isOwner) {
		return new Response(JSON.stringify({ error: 'Forbidden' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (!routeDoc.gpx || !routeDoc.gpx.contentBase64) {
		return new Response(JSON.stringify({ error: 'No GPX file available' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const gpxBuffer = Buffer.from(routeDoc.gpx.contentBase64, 'base64');
	const gpxXml = gpxBuffer.toString('utf-8');

	const allPoints = parseGpxCoordinates(gpxXml);

	if (allPoints.length === 0) {
		return new Response(JSON.stringify({ error: 'No coordinates found in GPX file' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const points = reducePoints(allPoints, MAX_POINTS);

	const bbox = calculateBoundingBox(points);

	return new Response(
		JSON.stringify({
			points,
			bbox
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
