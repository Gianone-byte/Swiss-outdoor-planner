import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { createSession, setSessionCookie, verifyPassword } from '$lib/server/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/feed');
	}
	return {};
}

export const actions = {
	default: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const email = (formData.get('email') ?? '').toString().trim().toLowerCase();
		const password = (formData.get('password') ?? '').toString();

		const errors = {};
		if (!emailRegex.test(email)) {
			errors.email = 'Enter a valid email address.';
		}
		if (!password) {
			errors.password = 'Password is required.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { email } });
		}

		const db = await getDb();
		const user = await db.collection('users').findOne({ email });
		if (!user) {
			return fail(400, { message: 'Invalid email or password.', values: { email } });
		}

		const matches = await verifyPassword(password, user.passwordHash);
		if (!matches) {
			return fail(400, { message: 'Invalid email or password.', values: { email } });
		}

		const token = await createSession(user._id);
		setSessionCookie(event.cookies, token);
		throw redirect(303, '/feed');
	}
};
