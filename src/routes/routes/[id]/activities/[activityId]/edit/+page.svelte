<script>
	const { data, form } = $props();

	const values = {
		date: form?.values?.date ?? data.activity.date,
		startTime: form?.values?.startTime ?? data.activity.startTime,
		durationMinutes: form?.values?.durationMinutes ?? data.activity.durationMinutes,
		feeling: form?.values?.feeling ?? data.activity.feeling,
		notes: form?.values?.notes ?? data.activity.notes,
		imageUrl1: form?.values?.imageUrl1 ?? data.activity.imageUrl1,
		imageUrl2: form?.values?.imageUrl2 ?? data.activity.imageUrl2,
		imageUrl3: form?.values?.imageUrl3 ?? data.activity.imageUrl3
	};

	const errors = form?.errors ?? {};
</script>

<section class="form-wrapper">
	<p class="back-link"><a href={`/routes/${data.route.id}`}>← Zurück zur Route</a></p>
	<h1>Aktivität bearbeiten</h1>
	<p>Route: <strong>{data.route.title}</strong></p>

	<form method="post" class="activity-form">
		<label>
			<span>Datum *</span>
			<input type="date" name="date" required value={values.date} />
			{#if errors.date}
				<span class="error">{errors.date}</span>
			{/if}
		</label>

		<label>
			<span>Startzeit *</span>
			<input type="time" name="startTime" required value={values.startTime} />
			{#if errors.startTime}
				<span class="error">{errors.startTime}</span>
			{/if}
		</label>

		<label>
			<span>Dauer (Minuten) *</span>
			<input type="number" name="durationMinutes" min="1" required value={values.durationMinutes} />
			{#if errors.durationMinutes}
				<span class="error">{errors.durationMinutes}</span>
			{/if}
		</label>

		<label>
			<span>Gefühl (1–5) *</span>
			<select name="feeling" required>
				{#each ['1', '2', '3', '4', '5'] as option}
					<option value={option} selected={values.feeling === option}>{option}</option>
				{/each}
			</select>
			{#if errors.feeling}
				<span class="error">{errors.feeling}</span>
			{/if}
		</label>

		<label>
			<span>Notizen</span>
			<textarea name="notes" rows="3">{values.notes}</textarea>
		</label>

		<div class="image-fields">
			<label>
				<span>Bild 1 (Link)</span>
				<input type="url" name="imageUrl1" placeholder="https://..." value={values.imageUrl1} />
			</label>
			<label>
				<span>Bild 2 (Link)</span>
				<input type="url" name="imageUrl2" placeholder="https://..." value={values.imageUrl2} />
			</label>
			<label>
				<span>Bild 3 (Link)</span>
				<input type="url" name="imageUrl3" placeholder="https://..." value={values.imageUrl3} />
			</label>
		</div>

		<button type="submit">Änderungen speichern</button>
	</form>
</section>

<style>
	.form-wrapper {
		background: white;
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 6px 12px rgba(5, 43, 86, 0.1);
	}

	.back-link a {
		text-decoration: none;
		color: #0a5eb7;
		font-size: 0.9rem;
	}

	.activity-form {
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-weight: 600;
	}

	input,
	select,
	textarea {
		padding: 0.6rem;
		border-radius: 8px;
		border: 1px solid #d0d7e2;
		font-size: 1rem;
	}

	textarea {
		resize: vertical;
	}

	.image-fields {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	button {
		margin-top: 0.5rem;
		border: none;
		background: #0a5eb7;
		color: white;
		padding: 0.85rem 1.4rem;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	.error {
		color: #c62828;
		font-size: 0.85rem;
		font-weight: 400;
	}
</style>
