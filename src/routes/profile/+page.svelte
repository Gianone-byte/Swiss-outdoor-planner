<script>
	const { data, form } = $props();
	const typeEntries = Object.keys(data.stats.distanceByType).map((type) => ({
		type,
		distance: data.stats.distanceByType[type],
		duration: data.stats.durationByType[type]
	}));

	// Form values with fallback to current data
	const profileValues = {
		username: form?.values?.username ?? data.profile.username ?? '',
		avatarUrl: form?.values?.avatarUrl ?? data.profile.avatarUrl ?? ''
	};
	const errors = form?.errors ?? {};

	// Feedback message
	let feedbackMessage = $derived(() => {
		if (form?.success) {
			return 'Profil erfolgreich gespeichert!';
		}
		return null;
	});
</script>

<section class="profile">
	<h1>Mein Profil</h1>

	{#if feedbackMessage()}
		<div class="feedback-message success">{feedbackMessage()}</div>
	{/if}

	<div class="profile-edit">
		<h2>Profil bearbeiten</h2>
		<form method="post" action="?/updateProfile" class="profile-form">
			<label>
				<span>Email</span>
				<input type="email" value={data.profile.email} disabled readonly />
				<span class="hint">Email kann nicht geändert werden.</span>
			</label>

			<label>
				<span>Username</span>
				<input
					type="text"
					name="username"
					value={profileValues.username}
					placeholder="z.B. bergwanderer"
					minlength="3"
					maxlength="30"
				/>
				{#if errors.username}
					<span class="error">{errors.username}</span>
				{/if}
			</label>

			<label>
				<span>Avatar URL</span>
				<input
					type="url"
					name="avatarUrl"
					value={profileValues.avatarUrl}
					placeholder="https://example.com/avatar.jpg"
				/>
				{#if errors.avatarUrl}
					<span class="error">{errors.avatarUrl}</span>
				{/if}
			</label>

			{#if profileValues.avatarUrl}
				<div class="avatar-preview">
					<span>Vorschau:</span>
					<img src={profileValues.avatarUrl} alt="Avatar Vorschau" />
				</div>
			{/if}

			<button type="submit">Speichern</button>
		</form>
	</div>
</section>

<section class="profile stats-section">
	<h2>Activity Statistiken</h2>
	<p>Übersicht über deine geloggten Aktivitäten.</p>

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

	.stats-section {
		margin-top: 2rem;
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

	.profile-edit {
		margin-bottom: 2rem;
	}

	.profile-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	.profile-form label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-weight: 600;
	}

	.profile-form input {
		padding: 0.6rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
		font-size: 1rem;
	}

	.profile-form input:disabled {
		background: #f1f5f9;
		color: #64748b;
		cursor: not-allowed;
	}

	.hint {
		font-size: 0.85rem;
		color: #64748b;
		font-weight: 400;
	}

	.error {
		color: #c62828;
		font-size: 0.85rem;
		font-weight: 400;
	}

	.avatar-preview {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.avatar-preview span {
		font-weight: 600;
	}

	.avatar-preview img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #e2e8f0;
	}

	.profile-form button {
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		border: none;
		background: #0a5eb7;
		color: #fff;
		font-weight: 600;
		cursor: pointer;
		width: fit-content;
	}

	.profile-form button:hover {
		background: #084a93;
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
