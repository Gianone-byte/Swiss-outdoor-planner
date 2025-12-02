<script>
	import ActivityList from '$lib/components/ActivityList.svelte';

	const { data, form } = $props();
	const isAdmin = data.role === 'admin';

	const updateErrors = form?.action === 'updateRoute' ? form.errors ?? {} : {};
	const updateValues = {
		distanceKm:
			form?.action === 'updateRoute'
				? form.values?.distanceKm ?? data.route.distanceKm
				: data.route.distanceKm,
		difficulty:
			form?.action === 'updateRoute'
				? form.values?.difficulty ?? data.route.difficulty
				: data.route.difficulty
	};
</script>

<section class="route-card">
	<div>
		<p class="back-link"><a href="/routes">← Back to routes</a></p>
		<h1>{data.route.title}</h1>
		<p class="muted">{data.route.region} · {data.route.type}</p>
		<ul class="stats">
			<li><strong>{data.route.distanceKm}</strong><span>km</span></li>
			{#if data.route.elevationGain !== undefined && data.route.elevationGain !== null}
				<li><strong>{data.route.elevationGain}</strong><span>m gain</span></li>
			{/if}
			<li><strong>{data.route.difficulty}</strong><span>difficulty</span></li>
			<li><strong>{data.route.createdAt}</strong><span>created</span></li>
		</ul>
	</div>
	<div class="actions">
		<a class="primary" href={`/routes/${data.route.id}/activities/new`}>Log activity</a>
		{#if isAdmin}
			<form method="post" action="?/deleteRoute">
				<button type="submit" class="danger">Delete route</button>
			</form>
		{/if}
	</div>
</section>

{#if isAdmin}
	<section class="admin-panel">
		<h2>Edit route basics</h2>
		<form method="post" action="?/updateRoute" class="inline-form">
			<label>
				<span>Distance (km)</span>
				<input
					type="number"
					name="distanceKm"
					min="0"
					step="0.1"
					value={updateValues.distanceKm}
					required
				/>
				{#if updateErrors.distanceKm}
					<span class="error">{updateErrors.distanceKm}</span>
				{/if}
			</label>
			<label>
				<span>Difficulty</span>
				<select name="difficulty" required>
					<option value="easy" selected={updateValues.difficulty === 'easy'}>Easy</option>
					<option value="medium" selected={updateValues.difficulty === 'medium'}>Medium</option>
					<option value="hard" selected={updateValues.difficulty === 'hard'}>Hard</option>
				</select>
				{#if updateErrors.difficulty}
					<span class="error">{updateErrors.difficulty}</span>
				{/if}
			</label>
			<button type="submit">Save changes</button>
		</form>
	</section>
{/if}

<section class="activities">
	<div class="section-head">
		<h2>Activities for this route</h2>
		<a href={`/routes/${data.route.id}/activities/new`}>+ Log activity</a>
	</div>
	<ActivityList
		activities={data.activities}
		showRouteInfo={false}
		showAdminActions={isAdmin}
		deleteAction="?/deleteActivity"
	/>
</section>

<style>
	.route-card {
		background: #fff;
		padding: 1.5rem;
		border-radius: 16px;
		box-shadow: 0 6px 20px rgba(5, 43, 86, 0.08);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.back-link a {
		text-decoration: none;
		color: #0a5eb7;
		font-size: 0.9rem;
	}

	.muted {
		color: #4b5563;
		margin-top: -0.3rem;
		text-transform: capitalize;
	}

	.stats {
		list-style: none;
		display: flex;
		gap: 1.5rem;
		padding: 0;
		margin: 1rem 0 0;
	}

	.stats li {
		display: flex;
		flex-direction: column;
		text-transform: uppercase;
		font-size: 0.8rem;
		color: #64748b;
	}

	.stats strong {
		font-size: 1.4rem;
		color: #111;
		text-transform: none;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.primary {
		background: #0a5eb7;
		color: #fff;
		text-decoration: none;
		padding: 0.7rem 1.2rem;
		border-radius: 10px;
		font-weight: 600;
	}

	.danger {
		background: #c62828;
		border: none;
		color: #fff;
		padding: 0.7rem 1.2rem;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 600;
	}

	.admin-panel {
		margin-top: 2rem;
		background: #fff;
		padding: 1.25rem;
		border-radius: 14px;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
	}

	.inline-form {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		align-items: end;
	}

	.inline-form label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-weight: 600;
	}

	input,
	select {
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
	}

	.inline-form button {
		height: fit-content;
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		border: none;
		background: #052b56;
		color: white;
		font-weight: 600;
		cursor: pointer;
	}

	.error {
		color: #c62828;
		font-size: 0.85rem;
		font-weight: 400;
	}

	.activities {
		margin-top: 2rem;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.section-head a {
		text-decoration: none;
		color: #0a5eb7;
		font-weight: 600;
	}
</style>
