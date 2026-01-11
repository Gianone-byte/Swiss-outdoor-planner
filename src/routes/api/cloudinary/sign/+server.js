import { json, error } from '@sveltejs/kit';
import crypto from 'crypto';
import { env } from '$env/dynamic/private';

/**
 * Cloudinary Signed Upload Endpoint
 * 
 * Generates a signature for secure client-side uploads to Cloudinary.
 * The API secret never leaves the server.
 */
export async function POST({ locals }) {
	// Require authenticated user
	if (!locals.user) {
		throw error(401, 'Authentication required');
	}

	// Check if Cloudinary is configured
	if (!env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_CLOUD_NAME) {
		throw error(500, 'Cloudinary is not configured');
	}

	const timestamp = Math.round(Date.now() / 1000);
	const folder = env.CLOUDINARY_FOLDER || 'swiss-outdoor-planner';

	// Build the string to sign (parameters must be in alphabetical order)
	// Format: folder=xxx&timestamp=xxxAPI_SECRET
	const stringToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
	
	// Create SHA-1 signature
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
