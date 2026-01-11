<script>
	import MapPreview from '$lib/components/MapPreview.svelte';

	export let routes = [];
	export let showAdminActions = false;
	export let deleteAction = "?/deleteRoute";
	export let showFavoriteButton = false;
	export let isFavoritedList = false;
</script>

{#if routes.length === 0}
	<p class="empty-message">Noch keine Routen gespeichert.</p>
{:else}
	<div class="routes-grid">
		{#each routes as route}
			<div class="route-card">
				<div class="route-header">
					<a href={`/routes/${route.id}`} class="route-title">{route.title}</a>
					<span class="badge type">{route.type}</span>
				</div>
				<div class="route-details">
					<span class="detail"><strong>Kanton:</strong> {route.kanton || route.region || '-'}</span>
					{#if route.ort}
						<span class="detail"><strong>Ort:</strong> {route.ort}</span>
					{/if}
					<span class="detail"><strong>Distanz:</strong> {route.distanceKm} km</span>
					<span class="detail"><strong>Schwierigkeit:</strong> {route.difficulty}</span>
				</div>
				{#if route.hasGpx && route.gpxPreview}
					<div class="map-preview-container">
						<MapPreview 
							points={route.gpxPreview.points} 
							bounds={route.gpxPreview.bounds}
						/>
					</div>
				{/if}
				<div class="route-actions">
					{#if showAdminActions}
						<form method="post" action={deleteAction}>
							<input type="hidden" name="routeId" value={route.id} />
							<button type="submit" class="danger-button">Delete</button>
						</form>
					{:else if showFavoriteButton}
						{#if route.isFavorited || isFavoritedList}
							<form method="post" action="?/removeFavorite">
								<input type="hidden" name="routeId" value={route.id} />
								<button type="submit" class="fav-button remove">Entfernen</button>
							</form>
						{:else}
							<form method="post" action="?/addFavorite">
								<input type="hidden" name="routeId" value={route.id} />
								<button type="submit" class="fav-button add">Merken</button>
							</form>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.routes-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.route-card {
		background: white;
		border-radius: 12px;
		padding: 1rem 1.25rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
	}

	.route-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.route-title {
		color: #0b5fad;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
	}

	.route-title:hover {
		text-decoration: underline;
	}

	.badge {
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.8rem;
		text-transform: capitalize;
		font-weight: 600;
	}

	.badge.type {
		background: #f3e8ff;
		color: #7c3aed;
	}

	.route-details {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		color: #4b5563;
		font-size: 0.9rem;
		margin-bottom: 0.75rem;
	}

	.map-preview-container {
		height: 200px;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}

	.route-actions {
		display: flex;
		gap: 0.5rem;
	}

	.danger-button {
		background: #c62828;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.35rem 0.75rem;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.danger-button:hover {
		background: #b71c1c;
	}

	.fav-button {
		border: none;
		border-radius: 6px;
		padding: 0.35rem 0.75rem;
		font-size: 0.85rem;
		cursor: pointer;
		font-weight: 500;
	}

	.fav-button.add {
		background: #0a5eb7;
		color: #fff;
	}

	.fav-button.add:hover {
		background: #084a93;
	}

	.fav-button.remove {
		background: #64748b;
		color: #fff;
	}

	.fav-button.remove:hover {
		background: #475569;
	}

	.empty-message {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}
</style>
