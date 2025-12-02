<script>
	import ActivityList from '$lib/components/ActivityList.svelte';

	const { data } = $props();
</script>

<section class="hero">
	<h1>Swiss Outdoor Planner</h1>
	<p>
		Plan beautiful hiking, running, and biking routes across Switzerland, then log your real-world
		activities with time, mood, and photo memories.
	</p>
	<div class="hero-actions">
		<a class="primary" href="/routes">View all routes</a>
		<a class="secondary" href="/routes/new">Create new route</a>
	</div>
</section>

<section class="recent">
	<div class="section-head">
		<h2>Latest activity logs</h2>
		<a href="/activities">View all activities →</a>
	</div>
	<ActivityList activities={data.recentActivities} showRouteInfo={true} />
</section>

<style>
	.hero {
		background: #fff;
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 6px 20px rgba(5, 43, 86, 0.08);
	}

	.hero h1 {
		margin: 0;
		font-size: 2.2rem;
	}

	.hero p {
		font-size: 1.05rem;
		color: #333;
		line-height: 1.5;
	}

	.hero-actions {
		margin-top: 1.5rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.hero-actions a {
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
	}

	.hero-actions .primary {
		background: #0a5eb7;
		color: #fff;
	}

	.hero-actions .secondary {
		border: 2px solid #0a5eb7;
		color: #0a5eb7;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.section-head a {
		color: #0a5eb7;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.recent {
		margin-top: 2rem;
	}
</style>
