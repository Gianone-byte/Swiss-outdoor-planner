import { json, error } from '@sveltejs/kit';
import crypto from 'crypto';
import { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_FOLDER } from '$env/static/private';

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
	if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
		throw error(500, 'Cloudinary is not configured');
	}

	const timestamp = Math.round(Date.now() / 1000);
	const folder = CLOUDINARY_FOLDER || 'swiss-outdoor-planner';

	// Build the string to sign (parameters must be in alphabetical order)
	// Format: folder=xxx&timestamp=xxxAPI_SECRET
	const stringToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
	
	// Create SHA-1 signature
	const signature = crypto
		.createHash('sha1')
		.update(stringToSign)
		.digest('hex');

	return json({
		timestamp,
		signature,
		apiKey: CLOUDINARY_API_KEY,
		cloudName: CLOUDINARY_CLOUD_NAME,
		folder
	});
}
