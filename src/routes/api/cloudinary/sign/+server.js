import { json, error } from '@sveltejs/kit';
import crypto from 'crypto';
import { env } from '$env/dynamic/private';

export async function POST({ locals }) {
	if (!locals.user) {
		throw error(401, 'Authentication required');
	}

	if (!env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_CLOUD_NAME) {
		throw error(500, 'Cloudinary is not configured');
	}

	const timestamp = Math.round(Date.now() / 1000);
	const folder = env.CLOUDINARY_FOLDER || 'swiss-outdoor-planner';

	const stringToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
	
	const signature = crypto
		.createHash('sha1')
		.update(stringToSign)
		.digest('hex');

	return json({
		timestamp,
		signature,
		apiKey: env.CLOUDINARY_API_KEY,
		cloudName: env.CLOUDINARY_CLOUD_NAME,
		folder
	});
}
