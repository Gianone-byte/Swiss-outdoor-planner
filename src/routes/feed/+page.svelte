<script>
	const { data } = $props();
</script>

<section class="feed-header">
	<h1>Activity Feed</h1>
	<p>Die neuesten Aktivitäten aller User auf einen Blick.</p>
</section>

{#if data.activities.length === 0}
	<div class="empty-state">
		<p>Noch keine Aktivitäten vorhanden.</p>
		<a href="/routes" class="cta">Erstelle deine erste Route</a>
	</div>
{:else}
	<ul class="feed-list">
		{#each data.activities as activity}
			<li class="feed-card">
				<div class="card-header">
					<div class="user-info">
						{#if activity.user.avatarUrl}
							<img src={activity.user.avatarUrl} alt="Avatar" class="user-avatar" />
						{:else}
							<div class="avatar-placeholder">👤</div>
						{/if}
						<span class="user-name">
							{activity.user.username || activity.user.email.split('@')[0]}
						</span>
					</div>
					<span class="activity-date">{activity.date}</span>
				</div>

				<div class="activity-content">
					<div class="route-info">
						{#if activity.canViewRoute}
							<a href={`/routes/${activity.routeId}`} class="route-title-link">
								{activity.routeTitle}
							</a>
						{:else}
							<span class="route-title">{activity.routeTitle}</span>
						{/if}
						<div class="route-meta">
							<span class="badge type">{activity.routeType}</span>
							{#if activity.routeRegion}
								<span class="badge region">{activity.routeRegion}</span>
							{/if}
							<span class="badge distance">{activity.routeDistanceKm} km</span>						{#if activity.hasGpx && activity.canViewRoute}
							<a href={`/routes/${activity.routeId}`} class="badge gpx-preview" title="Route auf Karte ansehen">
								🗺️ Kartenvorschau
							</a>
						{/if}						</div>
					</div>

					<div class="activity-stats">
						<span class="stat">
							<strong>{activity.durationMinutes}</strong> min
						</span>
						<span class="stat feeling">
							Feeling: <strong>{activity.feeling}/5</strong>
						</span>
						{#if activity.startTime}
							<span class="stat">Start: {activity.startTime}</span>
						{/if}
					</div>

					{#if activity.notes}
						<p class="notes">{activity.notes}</p>
					{/if}

					{#if activity.imageUrls?.length}
						<div class="activity-images">
							{#each activity.imageUrls as url, index}
								<div class="image-wrapper">
									<img 
										src={url} 
										alt={`Aktivitätsbild ${index + 1}`} 
										class="activity-image"
										loading="lazy"
										onerror={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
									/>
									<div class="image-error-fallback">
										<span>📷</span>
										<span>Nicht verfügbar</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.feed-header {
		background: #fff;
		padding: 1.5rem 2rem;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(5, 43, 86, 0.06);
		margin-bottom: 1.5rem;
	}

	.feed-header h1 {
		margin: 0;
	}

	.feed-header p {
		color: #64748b;
		margin: 0.25rem 0 0;
	}

	.empty-state {
		background: #fff;
		padding: 3rem 2rem;
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 4px 12px rgba(5, 43, 86, 0.06);
	}

	.empty-state p {
		font-size: 1.1rem;
		color: #64748b;
	}

	.cta {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.75rem 1.5rem;
		background: #0a5eb7;
		color: #fff;
		text-decoration: none;
		border-radius: 10px;
		font-weight: 600;
	}

	.feed-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.feed-card {
		background: #fff;
		border-radius: 14px;
		padding: 1.25rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #f1f5f9;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.user-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #e2e8f0;
	}

	.avatar-placeholder {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
	}

	.user-name {
		font-weight: 600;
		color: #1e293b;
	}

	.activity-date {
		color: #64748b;
		font-size: 0.9rem;
	}

	.activity-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.route-info {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.route-title-link {
		font-size: 1.1rem;
		font-weight: 600;
		color: #0a5eb7;
		text-decoration: none;
	}

	.route-title-link:hover {
		text-decoration: underline;
	}

	.route-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: #1e293b;
	}

	.route-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.badge {
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.8rem;
		text-transform: capitalize;
	}

	.badge.type {
		background: #f3e8ff;
		color: #7c3aed;
	}

	.badge.region {
		background: #ecfdf5;
		color: #059669;
	}

	.badge.distance {
		background: #e0f2fe;
		color: #0284c7;
	}

	.badge.gpx-preview {
		background: #fef3c7;
		color: #b45309;
		text-decoration: none;
		cursor: pointer;
		transition: background 0.15s ease, transform 0.1s ease;
	}

	.badge.gpx-preview:hover {
		background: #fde68a;
		transform: scale(1.02);
	}

	.activity-stats {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.stat {
		font-size: 0.9rem;
		color: #475569;
	}

	.stat strong {
		color: #1e293b;
	}

	.stat.feeling strong {
		color: #f59e0b;
	}

	.notes {
		margin: 0;
		font-size: 0.95rem;
		color: #334155;
		background: #f8fafc;
		padding: 0.75rem;
		border-radius: 8px;
		border-left: 3px solid #0a5eb7;
	}

	.activity-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.5rem;
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
		border-radius: 10px;
		border: 1px solid #e2e8f0;
	}

	.image-error-fallback {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #f1f5f9;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		color: #64748b;
		font-size: 0.7rem;
	}

	.image-error-fallback span:first-child {
		font-size: 1.25rem;
	}

	@media (max-width: 600px) {
		.card-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.activity-stats {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
