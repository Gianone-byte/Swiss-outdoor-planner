import { redirect } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';

export async function load(event) {
	await requireUser(event);
	throw redirect(303, '/');
}
