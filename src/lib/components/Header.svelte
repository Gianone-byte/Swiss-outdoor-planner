<script>
	import { page } from '$app/stores';

	const links = [
		{ href: '/feed', label: 'Feed' },
		{ href: '/routes', label: 'Routen' },
		{ href: '/activities', label: 'Aktivitäten' },
		{ href: '/profile', label: 'Profil' }
	];

	$: pathname = $page.url.pathname;
	$: user = $page.data.user;
	$: displayName = user?.username || user?.email?.split('@')[0] || 'User';
</script>

<header class="app-header">
	<div class="brand">
		<div class="logo">⛰️</div>
		<div>
			<p class="title">Swiss Outdoor Planner</p>
			<p class="subtitle">Routen entdecken, teilen und draussen erleben.</p>
		</div>
	</div>
	{#if user}
		<nav class="nav">
			{#each links as link}
				<a href={link.href} class:selected={pathname === link.href || pathname.startsWith(`${link.href}/`)}>
					{link.label}
				</a>
			{/each}
			<div class="user-info">
				{#if user.avatarUrl}
					<img src={user.avatarUrl} alt="Avatar" class="user-avatar" />
				{/if}
				<span class="user-name">{displayName}</span>
			</div>
			<form method="post" action="/logout" class="logout-form">
				<button type="submit">Log out</button>
			</form>
		</nav>
	{:else}
		<nav class="nav auth-links">
			<a href="/login" class:selected={pathname === '/login'}>Log in</a>
			<a href="/register" class:selected={pathname === '/register'}>Registrieren</a>
		</nav>
	{/if}
</header>

<style>
	.app-header {
		background: #052b56;
		color: #fff;
		padding: 1rem 1.5rem 1.2rem;
		display: flex;
		justify-content: space-between;
		gap: 1.5rem;
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
		align-items: center;
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

	.logout-form button {
		background: rgba(255, 255, 255, 0.18);
		border: 1px solid rgba(255, 255, 255, 0.4);
		color: #fff;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.logout-form button:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.6rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 999px;
	}

	.user-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid rgba(255, 255, 255, 0.5);
	}

	.user-name {
		font-size: 0.9rem;
		color: #fff;
		font-weight: 500;
	}

	@media (max-width: 900px) {
		.app-header {
			flex-direction: column;
			text-align: center;
		}

		.brand {
			justify-content: center;
		}

		.nav {
			justify-content: center;
		}
	}
</style>
