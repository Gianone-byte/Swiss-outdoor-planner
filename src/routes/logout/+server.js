import { redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { clearSessionCookie } from '$lib/server/auth';

async function handleLogout(event) {
	const token = event.cookies.get('session');
	if (token) {
		const db = await getDb();
		await db.collection('sessions').deleteOne({ token });
	}
	clearSessionCookie(event.cookies);
	throw redirect(303, '/login');
}

export async function POST(event) {
	await handleLogout(event);
}

export async function GET(event) {
	await handleLogout(event);
}
