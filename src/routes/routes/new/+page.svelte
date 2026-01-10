<script>
	const { form } = $props();

	const values = {
		title: form?.values?.title ?? '',
		type: form?.values?.type ?? 'hike',
		region: form?.values?.region ?? '',
		distanceKm: form?.values?.distanceKm ?? '',
		elevationGain: form?.values?.elevationGain ?? '',
		difficulty: form?.values?.difficulty ?? 'medium',
		visibility: form?.values?.visibility ?? 'private',
		swisstopoUrl: form?.values?.swisstopoUrl ?? ''
	};

	const errors = form?.errors ?? {};
</script>

<section class="form-wrapper">
	<h1>Neue Route erstellen</h1>
	<p>Definiere die wichtigsten Informationen für dein Schweizer Abenteuer.</p>

	<form method="post" class="route-form" enctype="multipart/form-data">
		<label>
			<span>Titel *</span>
			<input type="text" name="title" required value={values.title} />
			{#if errors.title}
				<span class="error">{errors.title}</span>
			{/if}
		</label>

		<label>
			<span>Typ *</span>
			<select name="type" required>
				<option value="hike" selected={values.type === 'hike'}>Wanderung</option>
				<option value="run" selected={values.type === 'run'}>Lauf</option>
				<option value="bike" selected={values.type === 'bike'}>Velo</option>
			</select>
			{#if errors.type}
				<span class="error">{errors.type}</span>
			{/if}
		</label>

		<label>
			<span>Region *</span>
			<input type="text" name="region" required value={values.region} />
			{#if errors.region}
				<span class="error">{errors.region}</span>
			{/if}
		</label>

		<label>
			<span>Distanz (km) *</span>
			<input type="number" name="distanceKm" min="0" step="0.1" required value={values.distanceKm} />
			{#if errors.distanceKm}
				<span class="error">{errors.distanceKm}</span>
			{/if}
		</label>

		<label>
			<span>Höhenmeter (m)</span>
			<input type="number" name="elevationGain" min="0" step="1" value={values.elevationGain} />
			{#if errors.elevationGain}
				<span class="error">{errors.elevationGain}</span>
			{/if}
		</label>

		<label>
			<span>Schwierigkeit *</span>
			<select name="difficulty" required>
				<option value="easy" selected={values.difficulty === 'easy'}>Einfach</option>
				<option value="medium" selected={values.difficulty === 'medium'}>Mittel</option>
				<option value="hard" selected={values.difficulty === 'hard'}>Schwer</option>
			</select>
			{#if errors.difficulty}
				<span class="error">{errors.difficulty}</span>
			{/if}
		</label>

		<label class="visibility">
			<span>Sichtbarkeit</span>
			<select name="visibility">
				<option value="private" selected={values.visibility === 'private'}>Privat</option>
				<option value="public" selected={values.visibility === 'public'}>Öffentlich</option>
			</select>
		</label>

		<label>
			<span>Swisstopo-Link (optional)</span>
			<input type="url" name="swisstopoUrl" value={values.swisstopoUrl} />
			{#if errors.swisstopoUrl}
				<span class="error">{errors.swisstopoUrl}</span>
			{/if}
		</label>

		<label>
			<span>GPX-Datei (optional)</span>
			<input
				type="file"
				name="gpx"
				accept=".gpx,application/gpx+xml,application/octet-stream"
			/>
			{#if errors.gpx}
				<span class="error">{errors.gpx}</span>
			{/if}
		</label>

		<button type="submit">Route speichern</button>
	</form>
</section>

<style>
	.form-wrapper {
		background: #fff;
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 6px 20px rgba(5, 43, 86, 0.08);
	}

	.route-form {
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-weight: 600;
	}

	input,
	select,
	textarea {
		padding: 0.6rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
		font-size: 1rem;
		font-weight: 400;
	}

	button {
		margin-top: 0.5rem;
		padding: 0.85rem 1.6rem;
		border-radius: 10px;
		border: none;
		font-size: 1rem;
		font-weight: 600;
		background: #0a5eb7;
		color: white;
		cursor: pointer;
	}

	.error {
		color: #c62828;
		font-weight: 400;
		font-size: 0.9rem;
	}
</style>
