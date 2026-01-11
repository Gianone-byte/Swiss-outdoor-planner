export function parseGpxPoints(gpxXml, maxPoints = 2000) {
	try {
		const points = [];
		
		const pointRegex = /<(?:trkpt|rtept)\s+lat=["']([^"']+)["']\s+lon=["']([^"']+)["'][^>]*>/gi;
		let match;
		
		while ((match = pointRegex.exec(gpxXml)) !== null) {
			const lat = parseFloat(match[1]);
			const lng = parseFloat(match[2]);
			if (!isNaN(lat) && !isNaN(lng)) {
				points.push({ lat, lng });
			}
		}
		
		if (points.length === 0) {
			return null;
		}
		
		let sampledPoints = points;
		if (points.length > maxPoints) {
			const step = Math.ceil(points.length / maxPoints);
			sampledPoints = points.filter((_, index) => index % step === 0);
			if (sampledPoints[sampledPoints.length - 1] !== points[points.length - 1]) {
				sampledPoints.push(points[points.length - 1]);
			}
		}
		
		let minLat = Infinity, maxLat = -Infinity;
		let minLng = Infinity, maxLng = -Infinity;
		
		for (const p of sampledPoints) {
			if (p.lat < minLat) minLat = p.lat;
			if (p.lat > maxLat) maxLat = p.lat;
			if (p.lng < minLng) minLng = p.lng;
			if (p.lng > maxLng) maxLng = p.lng;
		}
		
		return {
			points: sampledPoints,
			bounds: { minLat, minLng, maxLat, maxLng }
		};
	} catch (err) {
		console.error('Error parsing GPX:', err);
		return null;
	}
}
