<script>
	export let routes = [];
	export let showAdminActions = false;
	export let deleteAction = "?/deleteRoute";
	export let showFavoriteButton = false;
	export let isFavoritedList = false;
</script>

{#if routes.length === 0}
	<p class="empty-message">No routes saved yet.</p>
{:else}
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Type</th>
					<th>Region</th>
					<th>Distance (km)</th>
					<th>Difficulty</th>
					{#if showAdminActions || showFavoriteButton}
						<th aria-hidden="true"></th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each routes as route}
					<tr>
						<td>
							<a href={`/routes/${route.id}`}>{route.title}</a>
						</td>
						<td class="badge">{route.type}</td>
						<td>{route.region}</td>
						<td>{route.distanceKm}</td>
						<td>{route.difficulty}</td>
						{#if showAdminActions}
							<td>
								<form method="post" action={deleteAction}>
									<input
										type="hidden"
										name="routeId"
										value={route.id}
									/>
									<button type="submit" class="danger-button"
										>Delete</button
									>
								</form>
							</td>
						{:else if showFavoriteButton}
							<td>
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
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.table-wrapper {
		overflow-x: auto;
		background: white;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 620px;
	}

	th,
	td {
		padding: 0.85rem 1rem;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	thead th {
		background: #f8fafc;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	tbody tr:hover {
		background: #fdfdfd;
	}

	a {
		color: #0b5fad;
		text-decoration: none;
		font-weight: 600;
	}

	.badge {
		text-transform: capitalize;
		font-weight: 600;
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
