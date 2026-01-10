<script>
	import RouteList from '$lib/components/RouteList.svelte';

	const { data, form } = $props();
	let selectedType = data.currentType;
	const typeOptions = [
		{ label: 'Alle', value: 'all' },
		{ label: 'Wanderung', value: 'hike' },
		{ label: 'Lauf', value: 'run' },
		{ label: 'Velo', value: 'bike' }
	];

	// Feedback message for favorites
	let feedbackMessage = $derived(() => {
		if (form?.success && form?.action === 'addFavorite') {
			return form.alreadyFavorited ? 'Route war bereits gemerkt.' : 'Route gemerkt!';
		}
		if (form?.success && form?.action === 'removeFavorite') {
			return 'Route aus Favoriten entfernt.';
		}
		return null;
	});
</script>

<section class="header-row">
	<div>
		<h1>Gespeicherte Routen</h1>
		<p>Filtern, entdecken und Aktivitäten auf deinen Routen loggen.</p>
	</div>
	<a class="primary" href="/routes/new">+ Neue Route</a>
</section>

{#if feedbackMessage()}
	<div class="feedback-message success">{feedbackMessage()}</div>
{/if}

<form method="get" class="filter-form">
	<label for="type">Nach Aktivitätstyp filtern</label>
	<select id="type" name="type" bind:value={selectedType}>
		{#each typeOptions as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<button type="submit">Anwenden</button>
</form>

<section class="route-section">
	<h2>Meine Routen</h2>
	<RouteList
		routes={data.myRoutes}
		showAdminActions={true}
		deleteAction="?/deleteRoute"
	/>
</section>

{#if data.favoritedRoutes.length > 0}
	<section class="route-section">
		<h2>Gemerkte Routen</h2>
		<RouteList
			routes={data.favoritedRoutes}
			showAdminActions={false}
			showFavoriteButton={true}
			isFavoritedList={true}
		/>
		<p class="hint">Gemerkte öffentliche Routen anderer User.</p>
	</section>
{/if}

<section class="route-section">
	<h2>Öffentliche Routen</h2>
	<RouteList
		routes={data.publicRoutes}
		showAdminActions={false}
		showFavoriteButton={true}
	/>
	<p class="hint">Öffentliche Routen sind nur lesbar.</p>
</section>

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

	.feedback-message {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.feedback-message.success {
		background: #dcfce7;
		color: #166534;
		border: 1px solid #86efac;
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

	.route-section {
		margin-top: 1.5rem;
	}

	.hint {
		color: #64748b;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 600px) {
		.header-row {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
