import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { createSession, hashPassword, setSessionCookie } from '$lib/server/auth';

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
		const username = (formData.get('username') ?? '').toString().trim();
		const avatarUrl = (formData.get('avatarUrl') ?? '').toString().trim();
		const password = (formData.get('password') ?? '').toString();

		const errors = {};
		if (!emailRegex.test(email)) {
			errors.email = 'Enter a valid email address.';
		}
		if (!username) {
			errors.username = 'Username is required.';
		}
		if (password.length < 8) {
			errors.password = 'Password must be at least 8 characters.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				values: { email, username, avatarUrl }
			});
		}

		const db = await getDb();
		const existing = await db.collection('users').findOne({ email });
		if (existing) {
			return fail(400, {
				errors: { email: 'Email already registered.' },
				values: { email, username, avatarUrl }
			});
		}

		const passwordHash = await hashPassword(password);
		const result = await db.collection('users').insertOne({
			email,
			passwordHash,
			username,
			avatarUrl: avatarUrl || '',
			createdAt: new Date()
		});

		const token = await createSession(result.insertedId);
		setSessionCookie(event.cookies, token);
		throw redirect(303, '/feed');
	}
};
