<script>
	import MapPreview from '$lib/components/MapPreview.svelte';

	export let activities = [];
	export let showRouteInfo = false;
	export let showAdminActions = false;
	export let deleteAction = '?/deleteActivity';

	function handleImageError(e) {
		e.target.style.display = 'none';
		e.target.nextElementSibling.style.display = 'flex';
	}
</script>

{#if activities.length === 0}
	<p class="empty-message">Noch keine Aktivitäten geloggt.</p>
{:else}
	<ul class="activity-list">
		{#each activities as activity}
			<li class="activity-card">
				<div class="activity-meta">
					<div class="date-line">
						<strong>{activity.date}</strong>
						{#if activity.startTime}
							<span class="time">@ {activity.startTime}</span>
						{/if}
					</div>
					<div class="badges">
						<span class="badge mood">Feeling {activity.feeling}/5</span>
						<span class="badge duration">{activity.durationMinutes} Min</span>
						{#if showRouteInfo}
							<span class="badge type">{activity.routeType}</span>
							{#if activity.canViewRoute}
								<a class="route-link" href={`/routes/${activity.routeId}`}>{activity.routeTitle}</a>
							{:else}
								<span class="route-title">{activity.routeTitle}</span>
							{/if}
						{/if}
					</div>
					{#if activity.notes}
						<p class="notes">{activity.notes}</p>
					{/if}
					{#if activity.gpxPreview}
						<div class="map-preview-container">
							<MapPreview 
								points={activity.gpxPreview.points} 
								bounds={activity.gpxPreview.bounds}
							/>
						</div>
					{/if}
					{#if activity.imageUrls?.length}
						<div class="activity-images">
							{#each activity.imageUrls as url, index}
								<div class="image-wrapper">
									<img 
										src={url} 
										alt={`Aktivitätsbild ${index + 1} vom ${activity.date}`} 
										class="activity-image"
										loading="lazy"
										on:error={handleImageError}
									/>
									<div class="image-error-fallback">
										<span>📷</span>
										<span>Bild nicht verfügbar</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
				<div class="actions">
					{#if activity.editUrl}
						<a class="edit-button" href={activity.editUrl}>Bearbeiten</a>
					{/if}
					{#if showAdminActions}
						<form method="post" action={deleteAction}>
							<input type="hidden" name="activityId" value={activity.id} />
							<button type="submit" class="danger-button">Löschen</button>
						</form>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.activity-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-card {
		background: #fff;
		border-radius: 12px;
		padding: 1rem 1.2rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.activity-meta {
		flex: 1;
	}

	.date-line {
		font-size: 1.05rem;
	}

	.badges {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin: 0.5rem 0;
		align-items: center;
	}

	.badge {
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		font-size: 0.8rem;
		background: #eef2ff;
		text-transform: capitalize;
	}

	.badge.mood {
		background: #fff7ed;
	}

	.badge.duration {
		background: #e0f2fe;
	}

	.badge.type {
		background: #f3e8ff;
	}

	.route-link {
		font-weight: 600;
		color: #0f6fc5;
		text-decoration: none;
	}

	.route-title {
		font-weight: 600;
		color: #1f2937;
	}

	.notes {
		margin: 0.4rem 0 0;
		font-size: 0.95rem;
		background: #f8fafc;
		padding: 0.75rem;
		border-radius: 8px;
		border-left: 3px solid #0a5eb7;
	}

	.map-preview-container {
		height: 200px;
		border-radius: 10px;
		overflow: hidden;
		margin-top: 0.75rem;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.actions:empty {
		display: none;
	}

	.edit-button {
		background: #e0f2fe;
		color: #0b5fad;
		padding: 0.35rem 0.8rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.danger-button {
		background: #c62828;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.4rem 0.8rem;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.danger-button:hover {
		background: #b71c1c;
	}

	.activity-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.75rem;
	}

	.image-wrapper {
		position: relative;
		width: 180px;
		height: 140px;
	}

	.activity-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid #ddd;
	}

	.image-error-fallback {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #f1f5f9;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		color: #64748b;
		font-size: 0.75rem;
	}

	.image-error-fallback span:first-child {
		font-size: 1.5rem;
	}

	.empty-message {
		background: #fff;
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	@media (max-width: 700px) {
		.activity-card {
			flex-direction: column;
		}

		.actions {
			align-self: flex-end;
		}
	}
</style>
