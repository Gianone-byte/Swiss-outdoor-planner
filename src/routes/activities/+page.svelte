<script>
	import ActivityList from '$lib/components/ActivityList.svelte';

	const { data } = $props();
	let selectedType = data.typeFilter;
	const typeOptions = [
		{ label: 'Alle Routen', value: 'all' },
		{ label: 'Wanderung', value: 'hike' },
		{ label: 'Lauf', value: 'run' },
		{ label: 'Velo', value: 'bike' }
	];
</script>

<section class="header-row">
	<div>
		<h1>Aktivitäten Übersicht</h1>
		<p>Alle geloggten Ausflüge mit Statistiken und Fotos.</p>
	</div>
</section>

<form method="get" class="filter-form">
	<label>
		<span>Nach Routentyp filtern</span>
		<select name="type" bind:value={selectedType}>
			{#each typeOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</label>
	<button type="submit">Filter anwenden</button>
</form>

<ActivityList activities={data.activities} showRouteInfo={true} />

<style>
	.header-row {
		margin-bottom: 1.5rem;
	}

	.filter-form {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		background: #fff;
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-weight: 600;
	}

	select {
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid #d7dde6;
		min-width: 140px;
	}

	button {
		border: none;
		background: #052b56;
		color: white;
		padding: 0.6rem 1.2rem;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
	}
</style>
