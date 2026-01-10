<script>
	const { form } = $props();
	const errors = form?.errors ?? {};
	const values = form?.values ?? {};
</script>

<section class="auth-card">
	<h1>Log in</h1>
	<p>Willkommen zurück. Mach weiter wo du aufgehört hast.</p>

	<form method="post" class="auth-form">
		<label>
			<span>E-Mail</span>
			<input type="email" name="email" required value={values.email ?? ''} />
			{#if errors.email}
				<span class="error">{errors.email}</span>
			{/if}
		</label>
		<label>
			<span>Passwort</span>
			<input type="password" name="password" required />
			{#if errors.password}
				<span class="error">{errors.password}</span>
			{/if}
		</label>
		{#if form?.message}
			<p class="error">{form.message}</p>
		{/if}
		<button type="submit">Log in</button>
	</form>
	<p class="auth-switch">
		Neu hier? <a href="/register">Konto erstellen</a>.
	</p>
</section>

<style>
	.auth-card {
		max-width: 420px;
		margin: 0 auto;
		background: #fff;
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 6px 20px rgba(5, 43, 86, 0.12);
	}

	h1 {
		margin-top: 0;
	}

	.auth-form {
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
		font-weight: 600;
	}

	input {
		padding: 0.6rem 0.75rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
		font-size: 1rem;
	}

	button {
		margin-top: 0.5rem;
		padding: 0.7rem 1rem;
		border-radius: 10px;
		border: none;
		background: #052b56;
		color: #fff;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover {
		background: #0a3b73;
	}

	.error {
		color: #c62828;
		font-size: 0.9rem;
	}

	.auth-switch {
		margin-top: 1.5rem;
		text-align: center;
	}

	.auth-switch a {
		color: #0a5eb7;
		font-weight: 600;
		text-decoration: none;
	}
</style>
