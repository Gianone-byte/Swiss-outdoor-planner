<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/routes', label: 'Routes' },
		{ href: '/activities', label: 'Activities' },
		{ href: '/profile', label: 'Profile' }
	];

	const roles = [
		{ value: 'user', label: 'User' },
		{ value: 'admin', label: 'Admin' }
	];

	let currentRole = 'user';

	const getRoleFromCookie = () => {
		if (!browser) return 'user';
		const match = document.cookie.match(/(?:^|; )role=([^;]+)/);
		return match ? decodeURIComponent(match[1]) : 'user';
	};

	if (browser) {
		currentRole = getRoleFromCookie();
	}

	function handleRoleChange(event) {
		const nextRole = event.target.value;
		currentRole = nextRole;
		if (browser) {
			document.cookie = `role=${nextRole}; path=/; max-age=31536000`;
			window.location.reload();
		}
	}

	$: pathname = $page.url.pathname;
</script>

<header class="app-header">
	<div class="brand">
		<div class="logo">⛰️</div>
		<div>
			<p class="title">Swiss Outdoor Planner</p>
			<p class="subtitle">Plan routes · Log activities · Track progress</p>
		</div>
	</div>
	<nav class="nav">
		{#each links as link}
			<a href={link.href} class:selected={pathname === link.href || pathname.startsWith(`${link.href}/`)}>
				{link.label}
			</a>
		{/each}
	</nav>
	<div class="role-selector">
		<label for="role">Current role</label>
		<select id="role" on:change={handleRoleChange} bind:value={currentRole}>
			{#each roles as role}
				<option value={role.value}>{role.label}</option>
			{/each}
		</select>
	</div>
</header>

<style>
	.app-header {
		background: #052b56;
		color: #fff;
		padding: 1rem 1.5rem 1.2rem;
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) minmax(180px, auto);
		gap: 1rem;
		align-items: center;
	}

	.brand {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.logo {
		font-size: 2.25rem;
	}

	.title {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0;
	}

	.subtitle {
		margin: 0;
		font-size: 0.875rem;
		color: #c7d7ea;
	}

	.nav {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.nav a {
		color: #fff;
		text-decoration: none;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		font-size: 0.95rem;
		transition: background 0.2s ease;
	}

	.nav a:hover,
	.nav a.selected {
		background: rgba(255, 255, 255, 0.2);
	}

	.role-selector {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.85rem;
	}

	.role-selector select {
		padding: 0.35rem 0.5rem;
		border-radius: 6px;
		border: none;
		font-size: 0.9rem;
	}

	@media (max-width: 900px) {
		.app-header {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.brand {
			justify-content: center;
		}

		.nav {
			justify-content: center;
		}

		.role-selector {
			align-items: center;
		}
	}
</style>
