export function load({ locals }) {
	return {
		user: locals.user
			? {
					id: locals.user.id,
					email: locals.user.email,
					username: locals.user.username,
					avatarUrl: locals.user.avatarUrl ?? ''
				}
			: null
	};
}
