<script>
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Swiss Outdoor Planner</title>
</svelte:head>

<div class="app-shell">
	<Header />
	<main class="page-content">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #f4f4f4;
		color: #111;
	}

	:global(a) {
		color: inherit;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	.app-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.page-content {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
		padding: 2rem 1.5rem 3rem;
		flex: 1;
	}
</style>
