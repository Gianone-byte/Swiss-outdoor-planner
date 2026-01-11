import { fail, redirect } from '@sveltejs/kit';
import { getDb, ObjectId } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';
import { Buffer } from 'node:buffer';

const allowedTypes = ['hike', 'run', 'bike'];
const allowedDifficulties = ['easy', 'medium', 'hard'];
const allowedKantone = [
	'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft',
	'Basel-Stadt', 'Bern', 'Freiburg', 'Genf', 'Glarus', 'Graubünden', 'Jura',
	'Luzern', 'Neuenburg', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz',
	'Solothurn', 'St. Gallen', 'Tessin', 'Thurgau', 'Uri', 'Waadt', 'Wallis',
	'Zug', 'Zürich'
];

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
		const gpxFile = formData.get('gpx');

		const values = {
			title: formData.get('title')?.trim() ?? '',
			type: formData.get('type') ?? 'hike',
			kanton: formData.get('kanton')?.trim() ?? '',
			ort: formData.get('ort')?.trim() ?? '',
			distanceKm: formData.get('distanceKm') ? Number(formData.get('distanceKm')) : NaN,
			elevationGain: formData.get('elevationGain')
				? Number(formData.get('elevationGain'))
				: undefined,
			difficulty: formData.get('difficulty') ?? 'medium',
			visibility: formData.get('visibility') === 'public' ? 'public' : 'private',
			swisstopoUrl: formData.get('swisstopoUrl')?.trim() ?? ''
		};

		const errors = {};
		if (!values.title) errors.title = 'Titel ist erforderlich.';
		if (!allowedTypes.includes(values.type)) errors.type = 'Bitte Routentyp auswählen.';
		if (!values.kanton || !allowedKantone.includes(values.kanton)) {
			errors.kanton = 'Bitte Kanton auswählen.';
		}
		if (Number.isNaN(values.distanceKm) || values.distanceKm <= 0) {
			errors.distanceKm = 'Distanz muss eine positive Zahl sein.';
		}
		if (!allowedDifficulties.includes(values.difficulty)) {
			errors.difficulty = 'Bitte Schwierigkeitsgrad auswählen.';
		}
		if (
			values.elevationGain !== undefined &&
			(Number.isNaN(values.elevationGain) || values.elevationGain < 0)
		) {
			errors.elevationGain = 'Höhenmeter müssen 0 oder positiv sein.';
		}
		if (values.swisstopoUrl && !/^https?:\/\//i.test(values.swisstopoUrl)) {
			errors.swisstopoUrl = 'Swisstopo-Link muss mit http:// oder https:// beginnen.';
		}

		let gpxData = null;
		if (gpxFile && typeof gpxFile !== 'string' && gpxFile.size) {
			if (gpxFile.size > 2 * 1024 * 1024) {
				errors.gpx = 'GPX file must be 2 MB or smaller.';
			} else {
				const buffer = Buffer.from(await gpxFile.arrayBuffer());
				gpxData = {
					filename: gpxFile.name,
					contentBase64: buffer.toString('base64'),
					mimeType: gpxFile.type || 'application/gpx+xml',
					uploadedAt: new Date()
				};
			}
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const routeDoc = {
			title: values.title,
			type: values.type,
			kanton: values.kanton,
			ort: values.ort || null,
			distanceKm: values.distanceKm,
			difficulty: values.difficulty,
			visibility: values.visibility,
			ownerId: new ObjectId(event.locals.user._id),
			swisstopoUrl: values.swisstopoUrl || null,
			gpx: gpxData,
			createdAt: new Date()
		};

		if (values.elevationGain !== undefined) {
			routeDoc.elevationGain = values.elevationGain;
		}

		const result = await db.collection('routes').insertOne(routeDoc);
		throw redirect(303, `/routes/${result.insertedId.toString()}`);
	}
};
