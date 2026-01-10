import { getDb, ObjectId } from '$lib/server/db';
import { Buffer } from 'node:buffer';

const MAX_POINTS = 1500;

/**
 * Parses GPX XML and extracts coordinates as [lat, lng] pairs.
 * Prefers <trkpt> elements, falls back to <rtept>.
 * @param {string} gpxXml - The GPX file content as XML string
 * @returns {Array<[number, number]>} Array of [lat, lng] coordinate pairs
 */
function parseGpxCoordinates(gpxXml) {
	const points = [];

	// Try to extract <trkpt> elements first (track points)
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

	// Try alternative attribute order for trkpt
	if (points.length === 0) {
		while ((match = trkptRegexAlt.exec(gpxXml)) !== null) {
			const lng = parseFloat(match[1]);
			const lat = parseFloat(match[2]);
			if (!isNaN(lat) && !isNaN(lng)) {
				points.push([lat, lng]);
			}
		}
	}

	// Fallback to <rtept> elements (route points) if no track points found
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

		// Try alternative attribute order for rtept
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

/**
 * Reduces the number of points by taking every n-th point.
 * @param {Array<[number, number]>} points - Original coordinate array
 * @param {number} maxPoints - Maximum number of points to return
 * @returns {Array<[number, number]>} Reduced coordinate array
 */
function reducePoints(points, maxPoints) {
	if (points.length <= maxPoints) {
		return points;
	}

	const step = Math.ceil(points.length / maxPoints);
	const reduced = [];

	for (let i = 0; i < points.length; i += step) {
		reduced.push(points[i]);
	}

	// Always include the last point for continuity
	const lastPoint = points[points.length - 1];
	const lastReduced = reduced[reduced.length - 1];
	if (lastPoint[0] !== lastReduced[0] || lastPoint[1] !== lastReduced[1]) {
		reduced.push(lastPoint);
	}

	return reduced;
}

/**
 * Calculates the bounding box for a set of coordinates.
 * @param {Array<[number, number]>} points - Array of [lat, lng] coordinate pairs
 * @returns {{ minLat: number, maxLat: number, minLng: number, maxLng: number }}
 */
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

	// Validate route ID
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

	// Route not found
	if (!routeDoc) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Access control: public routes or owner only
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

	// Check if GPX file exists
	if (!routeDoc.gpx || !routeDoc.gpx.contentBase64) {
		return new Response(JSON.stringify({ error: 'No GPX file available' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Decode base64 GPX content to XML string
	const gpxBuffer = Buffer.from(routeDoc.gpx.contentBase64, 'base64');
	const gpxXml = gpxBuffer.toString('utf-8');

	// Parse coordinates from GPX
	const allPoints = parseGpxCoordinates(gpxXml);

	if (allPoints.length === 0) {
		return new Response(JSON.stringify({ error: 'No coordinates found in GPX file' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Reduce points if necessary (max 1500)
	const points = reducePoints(allPoints, MAX_POINTS);

	// Calculate bounding box
	const bbox = calculateBoundingBox(points);

	// Return JSON response (never include contentBase64!)
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
