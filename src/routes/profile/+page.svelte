<script>
	const { data } = $props();
	const typeEntries = Object.keys(data.stats.distanceByType).map((type) => ({
		type,
		distance: data.stats.distanceByType[type],
		duration: data.stats.durationByType[type]
	}));
</script>

<section class="profile">
	<h1>Activity profile</h1>
	<p>High-level stats across every role. Track progress and see where photos were captured.</p>

	<div class="cards">
		<div class="card">
			<p>Total activities</p>
			<strong>{data.stats.totalActivities}</strong>
		</div>
		<div class="card">
			<p>Activities with images</p>
			<strong>{data.stats.activitiesWithImages}</strong>
		</div>
		<div class="card">
			<p>Activities without images</p>
			<strong>{data.stats.activitiesWithoutImages}</strong>
		</div>
	</div>

	<div class="breakdown">
		<h2>Distance & duration by type</h2>
		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Total distance (km)</th>
					<th>Total duration (min)</th>
				</tr>
			</thead>
			<tbody>
				{#each typeEntries as entry}
					<tr>
						<td class="type">{entry.type}</td>
						<td>{entry.distance.toFixed(1)}</td>
						<td>{entry.duration}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.profile {
		background: #fff;
		padding: 2rem;
		border-radius: 18px;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
	}

	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		margin: 1.5rem 0;
	}

	.card {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1rem;
		text-align: center;
	}

	.card p {
		margin: 0;
		color: #4b5563;
	}

	.card strong {
		display: block;
		font-size: 2rem;
		margin-top: 0.5rem;
	}

	.breakdown table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	thead {
		background: #f8fafc;
		text-transform: uppercase;
		font-size: 0.85rem;
	}

	.type {
		text-transform: capitalize;
		font-weight: 600;
	}
</style>
