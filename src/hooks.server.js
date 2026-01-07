import { clearSessionCookie, getUserFromSession } from '$lib/server/auth';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('session');

	if (token) {
		const user = await getUserFromSession(token);
		if (user) {
			event.locals.user = user;
		} else {
			event.locals.user = null;
			clearSessionCookie(event.cookies);
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
}
