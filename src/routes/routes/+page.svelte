<script>
	import RouteList from '$lib/components/RouteList.svelte';

	let { data, form } = $props();
	
	// Local state for form selects - initialized from URL params
	let selectedType = $state('all');
	let selectedKanton = $state('all');
	
	// Update local state when data changes (e.g., on navigation)
	$effect(() => {
		selectedType = data.currentType;
		selectedKanton = data.currentKanton;
	});
	
	const typeOptions = [
		{ label: 'Alle', value: 'all' },
		{ label: 'Wanderung', value: 'hike' },
		{ label: 'Lauf', value: 'run' },
		{ label: 'Velo', value: 'bike' }
	];

	const kantonOptions = [
		{ label: 'Alle Kantone', value: 'all' },
		{ label: 'Aargau', value: 'Aargau' },
		{ label: 'Appenzell Ausserrhoden', value: 'Appenzell Ausserrhoden' },
		{ label: 'Appenzell Innerrhoden', value: 'Appenzell Innerrhoden' },
		{ label: 'Basel-Landschaft', value: 'Basel-Landschaft' },
		{ label: 'Basel-Stadt', value: 'Basel-Stadt' },
		{ label: 'Bern', value: 'Bern' },
		{ label: 'Freiburg', value: 'Freiburg' },
		{ label: 'Genf', value: 'Genf' },
		{ label: 'Glarus', value: 'Glarus' },
		{ label: 'Graubünden', value: 'Graubünden' },
		{ label: 'Jura', value: 'Jura' },
		{ label: 'Luzern', value: 'Luzern' },
		{ label: 'Neuenburg', value: 'Neuenburg' },
		{ label: 'Nidwalden', value: 'Nidwalden' },
		{ label: 'Obwalden', value: 'Obwalden' },
		{ label: 'Schaffhausen', value: 'Schaffhausen' },
		{ label: 'Schwyz', value: 'Schwyz' },
		{ label: 'Solothurn', value: 'Solothurn' },
		{ label: 'St. Gallen', value: 'St. Gallen' },
		{ label: 'Tessin', value: 'Tessin' },
		{ label: 'Thurgau', value: 'Thurgau' },
		{ label: 'Uri', value: 'Uri' },
		{ label: 'Waadt', value: 'Waadt' },
		{ label: 'Wallis', value: 'Wallis' },
		{ label: 'Zug', value: 'Zug' },
		{ label: 'Zürich', value: 'Zürich' }
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
	<a class="new-route-btn" href="/routes/new">+ Neue Route</a>
</section>

{#if feedbackMessage()}
	<div class="feedback-message success">{feedbackMessage()}</div>
{/if}

<form method="get" class="filter-form">
	<div class="filter-group">
		<label for="type">Typ</label>
		<select id="type" name="type" bind:value={selectedType}>
			{#each typeOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
	
	<div class="filter-group">
		<label for="kanton">Kanton</label>
		<select id="kanton" name="kanton" bind:value={selectedKanton}>
			{#each kantonOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
	
	<button type="submit">Anwenden</button>
</form>

<div class="routes-grid">
	<section class="route-section">
		<h2>Meine Routen</h2>
		<RouteList
			routes={data.myRoutes}
			showAdminActions={true}
			deleteAction="?/deleteRoute"
		/>
		{#if data.favoritedRoutes.length > 0}
			<h3 class="sub-heading">Gemerkte Routen</h3>
			<RouteList
				routes={data.favoritedRoutes}
				showAdminActions={false}
				showFavoriteButton={true}
				isFavoritedList={true}
			/>
		{/if}
	</section>

	<section class="route-section">
		<h2>Öffentliche Routen</h2>
		<RouteList
			routes={data.publicRoutes}
			showAdminActions={false}
			showFavoriteButton={true}
		/>
	</section>
</div>

<style>
	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	.new-route-btn {
		display: inline-block;
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		background: #0a5eb7;
		color: #fff;
		text-decoration: none;
		font-weight: 600;
		white-space: nowrap;
	}

	.new-route-btn:hover {
		background: #084a93;
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
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: center;
		gap: 1rem;
		background: #fff;
		padding: 1rem 1.5rem;
		border-radius: 10px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		flex-wrap: wrap;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.filter-group label {
		font-weight: 600;
		font-size: 0.85rem;
		color: #1e293b;
	}

	select {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		border: 1px solid #cfcfcf;
		font-size: 0.95rem;
		min-width: 160px;
	}

	.filter-form button {
		padding: 0.5rem 1.25rem;
		border-radius: 6px;
		border: none;
		background: #052b56;
		color: #fff;
		font-weight: 600;
		cursor: pointer;
		font-size: 0.95rem;
	}

	.filter-form button:hover {
		background: #07417f;
	}

	.routes-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: start;
	}

	.route-section {
		background: #fff;
		padding: 1.25rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.route-section h2 {
		margin: 0 0 1rem;
		font-size: 1.1rem;
		color: #052b56;
	}

	.sub-heading {
		margin: 1.5rem 0 0.75rem;
		font-size: 1rem;
		color: #64748b;
		border-top: 1px solid #e2e8f0;
		padding-top: 1rem;
	}

	@media (max-width: 900px) {
		.routes-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.header-row {
			flex-direction: column;
			align-items: flex-start;
		}

		.filter-form {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-group {
			width: 100%;
		}

		select {
			width: 100%;
		}

		.filter-form button {
			width: 100%;
		}
	}
</style>
