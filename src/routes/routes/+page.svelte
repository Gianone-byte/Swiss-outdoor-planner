<script>
	import RouteList from '$lib/components/RouteList.svelte';

	const { data } = $props();
	let selectedType = data.currentType;
	const typeOptions = [
		{ label: 'All', value: 'all' },
		{ label: 'Hike', value: 'hike' },
		{ label: 'Run', value: 'run' },
		{ label: 'Bike', value: 'bike' }
	];
</script>

<section class="header-row">
	<div>
		<h1>Saved routes</h1>
		<p>Filter, explore, and open any route to log your latest activity.</p>
	</div>
	<a class="primary" href="/routes/new">+ New route</a>
</section>

<form method="get" class="filter-form">
	<label for="type">Filter by activity type</label>
	<select id="type" name="type" bind:value={selectedType}>
		{#each typeOptions as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<button type="submit">Apply</button>
</form>

<RouteList
	routes={data.routes}
	showAdminActions={data.role === 'admin'}
	deleteAction="?/deleteRoute"
/>

<style>
	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.primary {
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		background: #0a5eb7;
		color: #fff;
		text-decoration: none;
		font-weight: 600;
	}

	.filter-form {
		margin-bottom: 1rem;
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
		flex-wrap: wrap;
		background: #fff;
		padding: 1rem;
		border-radius: 10px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	label {
		font-weight: 600;
	}

	select {
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid #cfcfcf;
		min-width: 140px;
	}

	button {
		padding: 0.55rem 1rem;
		border-radius: 8px;
		border: none;
		background: #052b56;
		color: #fff;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover {
		background: #07417f;
	}

	@media (max-width: 600px) {
		.header-row {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
