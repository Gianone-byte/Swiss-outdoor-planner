<script>
	const { form } = $props();

	const values = {
		title: form?.values?.title ?? '',
		type: form?.values?.type ?? 'hike',
		region: form?.values?.region ?? '',
		distanceKm: form?.values?.distanceKm ?? '',
		elevationGain: form?.values?.elevationGain ?? '',
		difficulty: form?.values?.difficulty ?? 'medium',
		visibility: form?.values?.visibility ?? 'private'
	};

	const errors = form?.errors ?? {};
</script>

<section class="form-wrapper">
	<h1>Create a new route</h1>
	<p>Define the key information about your Swiss adventure before logging activities.</p>

	<form method="post" class="route-form">
		<label>
			<span>Title *</span>
			<input type="text" name="title" required value={values.title} />
			{#if errors.title}
				<span class="error">{errors.title}</span>
			{/if}
		</label>

		<label>
			<span>Type *</span>
			<select name="type" required>
				<option value="hike" selected={values.type === 'hike'}>Hike</option>
				<option value="run" selected={values.type === 'run'}>Run</option>
				<option value="bike" selected={values.type === 'bike'}>Bike</option>
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
			<span>Distance (km) *</span>
			<input type="number" name="distanceKm" min="0" step="0.1" required value={values.distanceKm} />
			{#if errors.distanceKm}
				<span class="error">{errors.distanceKm}</span>
			{/if}
		</label>

		<label>
			<span>Elevation gain (m)</span>
			<input type="number" name="elevationGain" min="0" step="10" value={values.elevationGain} />
			{#if errors.elevationGain}
				<span class="error">{errors.elevationGain}</span>
			{/if}
		</label>

		<label>
			<span>Difficulty *</span>
			<select name="difficulty" required>
				<option value="easy" selected={values.difficulty === 'easy'}>Easy</option>
				<option value="medium" selected={values.difficulty === 'medium'}>Medium</option>
				<option value="hard" selected={values.difficulty === 'hard'}>Hard</option>
			</select>
			{#if errors.difficulty}
				<span class="error">{errors.difficulty}</span>
			{/if}
		</label>

		<label class="visibility">
			<span>Route oeffentlich machen</span>
			<select name="visibility">
				<option value="private" selected={values.visibility === 'private'}>Private</option>
				<option value="public" selected={values.visibility === 'public'}>Public</option>
			</select>
		</label>

		<button type="submit">Save route</button>
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
