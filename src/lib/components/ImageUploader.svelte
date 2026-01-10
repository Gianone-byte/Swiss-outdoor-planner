<script>
	import { validateFile, uploadToCloudinary } from '$lib/cloudinary.js';

	// Props
	/** @type {string[]} */
	export let imageUrls = [];
	/** @type {number} */
	export let maxImages = 3;
	/** @type {boolean} */
	export let disabled = false;

	// Internal state
	let isDragOver = false;
	let fileInput;
	let uploadingFiles = []; // { file, progress, error, status: 'uploading'|'done'|'error' }
	let urlInput = '';
	let urlError = '';

	// Reactive: check if we can add more images
	$: canAddMore = imageUrls.length + uploadingFiles.filter(f => f.status === 'uploading').length < maxImages;
	$: totalImages = imageUrls.length;

	// Handle file selection
	async function handleFiles(files) {
		if (disabled) return;

		const fileArray = Array.from(files);
		const availableSlots = maxImages - imageUrls.length - uploadingFiles.filter(f => f.status === 'uploading').length;

		if (availableSlots <= 0) {
			return;
		}

		const filesToUpload = fileArray.slice(0, availableSlots);

		for (const file of filesToUpload) {
			const validation = validateFile(file);
			if (!validation.valid) {
				uploadingFiles = [...uploadingFiles, { 
					file, 
					progress: 0, 
					error: validation.error, 
					status: 'error',
					name: file.name 
				}];
				continue;
			}

			const uploadEntry = { 
				file, 
				progress: 0, 
				error: null, 
				status: 'uploading',
				name: file.name 
			};
			uploadingFiles = [...uploadingFiles, uploadEntry];
			const entryIndex = uploadingFiles.length - 1;

			// Start upload
			const result = await uploadToCloudinary(file, (progress) => {
				uploadingFiles = uploadingFiles.map((entry, i) => 
					i === entryIndex ? { ...entry, progress } : entry
				);
			});

			if (result.success && result.url) {
				// Add URL and remove from uploading
				imageUrls = [...imageUrls, result.url];
				uploadingFiles = uploadingFiles.filter((_, i) => i !== entryIndex);
			} else {
				uploadingFiles = uploadingFiles.map((entry, i) => 
					i === entryIndex ? { ...entry, status: 'error', error: result.error } : entry
				);
			}
		}
	}

	// Drag & Drop handlers
	function handleDragOver(event) {
		event.preventDefault();
		if (!disabled && canAddMore) {
			isDragOver = true;
		}
	}

	function handleDragLeave(event) {
		event.preventDefault();
		isDragOver = false;
	}

	function handleDrop(event) {
		event.preventDefault();
		isDragOver = false;
		if (disabled || !canAddMore) return;

		const files = event.dataTransfer?.files;
		if (files?.length) {
			handleFiles(files);
		}
	}

	// File input change
	function handleFileInputChange(event) {
		const files = event.target.files;
		if (files?.length) {
			handleFiles(files);
		}
		// Reset input so same file can be selected again
		event.target.value = '';
	}

	// Click to select files
	function triggerFileSelect() {
		if (!disabled && canAddMore) {
			fileInput?.click();
		}
	}

	// Remove an uploaded image
	function removeImage(index) {
		if (disabled) return;
		imageUrls = imageUrls.filter((_, i) => i !== index);
	}

	// Remove a failed upload entry
	function removeUploadEntry(index) {
		uploadingFiles = uploadingFiles.filter((_, i) => i !== index);
	}

	// Add URL manually
	function addManualUrl() {
		urlError = '';
		const url = urlInput.trim();

		if (!url) {
			urlError = 'URL eingeben';
			return;
		}

		if (!url.startsWith('https://')) {
			urlError = 'URL muss mit https:// beginnen';
			return;
		}

		if (imageUrls.length >= maxImages) {
			urlError = `Maximal ${maxImages} Bilder erlaubt`;
			return;
		}

		if (imageUrls.includes(url)) {
			urlError = 'Diese URL wurde bereits hinzugefügt';
			return;
		}

		imageUrls = [...imageUrls, url];
		urlInput = '';
	}

	// Handle image load error
	function handleImageError(event) {
		event.target.src = '';
		event.target.alt = 'Bild konnte nicht geladen werden';
		event.target.classList.add('image-error');
	}
</script>

<div class="image-uploader">
	<div class="uploader-header">
		<span class="label">Bilder ({totalImages}/{maxImages})</span>
	</div>

	<!-- Uploaded images preview -->
	{#if imageUrls.length > 0}
		<div class="preview-grid">
			{#each imageUrls as url, index}
				<div class="preview-item">
					<img 
						src={url} 
						alt="Vorschau {index + 1}" 
						on:error={handleImageError}
					/>
					{#if !disabled}
						<button 
							type="button" 
							class="remove-btn" 
							on:click={() => removeImage(index)}
							title="Bild entfernen"
						>
							×
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Uploading files -->
	{#if uploadingFiles.length > 0}
		<div class="upload-status-list">
			{#each uploadingFiles as entry, index}
				<div class="upload-status-item" class:error={entry.status === 'error'}>
					<span class="file-name">{entry.name}</span>
					{#if entry.status === 'uploading'}
						<div class="progress-bar">
							<div class="progress-fill" style="width: {entry.progress}%"></div>
						</div>
						<span class="progress-text">{entry.progress}%</span>
					{:else if entry.status === 'error'}
						<span class="error-text">{entry.error}</span>
						<button type="button" class="dismiss-btn" on:click={() => removeUploadEntry(index)}>×</button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Drag & Drop Zone -->
	{#if canAddMore && !disabled}
		<div 
			class="drop-zone"
			class:drag-over={isDragOver}
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
			on:click={triggerFileSelect}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && triggerFileSelect()}
		>
			<input 
				type="file" 
				accept="image/jpeg,image/png,image/webp"
				multiple
				bind:this={fileInput}
				on:change={handleFileInputChange}
				class="file-input"
			/>
			<div class="drop-zone-content">
				<span class="drop-icon">📷</span>
				<span class="drop-text">
					Bilder hierher ziehen<br>oder klicken zum Auswählen
				</span>
				<span class="drop-hint">JPG, PNG, WebP · max. 5 MB</span>
			</div>
		</div>
	{/if}

	<!-- Manual URL input (optional, for backwards compatibility) -->
	{#if canAddMore && !disabled}
		<div class="url-input-section">
			<span class="url-label">Oder Bild-URL hinzufügen:</span>
			<div class="url-input-row">
				<input 
					type="url" 
					bind:value={urlInput}
					placeholder="https://..."
					class="url-input"
					on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualUrl())}
				/>
				<button type="button" class="add-url-btn" on:click={addManualUrl}>+</button>
			</div>
			{#if urlError}
				<span class="url-error">{urlError}</span>
			{/if}
		</div>
	{/if}

	<!-- Hidden inputs for form submission -->
	{#each imageUrls as url, index}
		<input type="hidden" name="imageUrl{index + 1}" value={url} />
	{/each}
</div>

<style>
	.image-uploader {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.uploader-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.preview-item {
		position: relative;
		aspect-ratio: 1;
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.preview-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.remove-btn {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.remove-btn:hover {
		background: rgba(198, 40, 40, 0.9);
	}

	.upload-status-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.upload-status-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: #f1f5f9;
		border-radius: 8px;
		font-size: 0.9rem;
	}

	.upload-status-item.error {
		background: #fef2f2;
		border: 1px solid #fecaca;
	}

	.file-name {
		flex-shrink: 0;
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: #e2e8f0;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #0a5eb7;
		transition: width 0.2s ease;
	}

	.progress-text {
		font-size: 0.8rem;
		color: #64748b;
		min-width: 35px;
		text-align: right;
	}

	.error-text {
		flex: 1;
		color: #c62828;
		font-size: 0.85rem;
	}

	.dismiss-btn {
		border: none;
		background: none;
		color: #64748b;
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0 0.25rem;
	}

	.drop-zone {
		border: 2px dashed #cbd5e1;
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		background: #fafbfc;
	}

	.drop-zone:hover {
		border-color: #0a5eb7;
		background: #f0f7ff;
	}

	.drop-zone.drag-over {
		border-color: #0a5eb7;
		background: #e0f0ff;
		border-style: solid;
	}

	.file-input {
		display: none;
	}

	.drop-zone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.drop-icon {
		font-size: 2rem;
	}

	.drop-text {
		color: #475569;
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.drop-hint {
		color: #94a3b8;
		font-size: 0.8rem;
	}

	.url-input-section {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding-top: 0.5rem;
		border-top: 1px solid #e2e8f0;
	}

	.url-label {
		font-size: 0.85rem;
		color: #64748b;
	}

	.url-input-row {
		display: flex;
		gap: 0.5rem;
	}

	.url-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d0d7e2;
		border-radius: 8px;
		font-size: 0.9rem;
	}

	.add-url-btn {
		padding: 0.5rem 1rem;
		border: none;
		background: #e2e8f0;
		color: #475569;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
	}

	.add-url-btn:hover {
		background: #cbd5e1;
	}

	.url-error {
		color: #c62828;
		font-size: 0.8rem;
	}
</style>
