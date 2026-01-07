import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getDb, ObjectId } from '$lib/server/db';

const SESSION_DAYS = 14;
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

function toObjectId(value) {
	return value instanceof ObjectId ? value : new ObjectId(value);
}

export async function hashPassword(password) {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

export async function createSession(userId) {
	const token = randomBytes(32).toString('hex');
	const createdAt = new Date();
	const expiresAt = new Date(createdAt.getTime() + SESSION_MAX_AGE * 1000);
	const db = await getDb();

	await db.collection('sessions').insertOne({
		token,
		userId: toObjectId(userId),
		createdAt,
		expiresAt
	});

	return token;
}

export async function getUserFromSession(token) {
	if (!token) return null;
	const db = await getDb();
	const session = await db.collection('sessions').findOne({
		token,
		expiresAt: { $gt: new Date() }
	});

	if (!session) return null;

	const user = await db.collection('users').findOne({ _id: session.userId });
	if (!user) return null;

	return {
		_id: user._id.toString(),
		id: user._id.toString(),
		email: user.email,
		username: user.username,
		avatarUrl: user.avatarUrl ?? ''
	};
}

export async function requireUser(event) {
	if (!event.locals.user) {
		throw redirect(303, '/login');
	}
	return event.locals.user;
}

export function setSessionCookie(cookies, token) {
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: SESSION_MAX_AGE
	});
}

export function clearSessionCookie(cookies) {
	cookies.set('session', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: 0
	});
}
