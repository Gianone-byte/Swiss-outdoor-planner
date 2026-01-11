const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function validateFile(file) {
	if (!file || !(file instanceof File)) {
		return { valid: false, error: 'Ungültige Datei' };
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return { valid: false, error: 'Nur JPG, PNG und WebP erlaubt' };
	}

	if (file.size > MAX_FILE_SIZE) {
		return { valid: false, error: 'Datei zu gross (max. 5 MB)' };
	}

	return { valid: true };
}

export async function uploadToCloudinary(file, onProgress) {
	const validation = validateFile(file);
	if (!validation.valid) {
		return { success: false, error: validation.error };
	}

	try {
		
		const signResponse = await fetch('/api/cloudinary/sign', {
			method: 'POST',
			credentials: 'include'
		});

		if (!signResponse.ok) {
			const errorText = await signResponse.text();
			console.error('Sign error:', errorText);
			return { success: false, error: 'Signatur konnte nicht erstellt werden' };
		}

		const { timestamp, signature, apiKey, cloudName, folder } = await signResponse.json();

		
		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', apiKey);
		formData.append('timestamp', timestamp.toString());
		formData.append('signature', signature);
		formData.append('folder', folder);

	
		const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

		
		const result = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable && onProgress) {
					const percent = Math.round((event.loaded / event.total) * 100);
					onProgress(percent);
				}
			});

			xhr.addEventListener('load', () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const response = JSON.parse(xhr.responseText);
						resolve({ success: true, url: response.secure_url });
					} catch {
						reject(new Error('Ungültige Antwort von Cloudinary'));
					}
				} else {
					reject(new Error(`Upload fehlgeschlagen: ${xhr.status}`));
				}
			});

			xhr.addEventListener('error', () => {
				reject(new Error('Netzwerkfehler beim Upload'));
			});

			xhr.addEventListener('abort', () => {
				reject(new Error('Upload abgebrochen'));
			});

			xhr.open('POST', uploadUrl);
			xhr.send(formData);
		});

		return result;
	} catch (err) {
		console.error('Upload error:', err);
		return { success: false, error: err.message || 'Upload fehlgeschlagen' };
	}
}

/**
 * Uploads multiple files to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @param {(index: number, progress: number) => void} [onProgress] - Progress callback per file
 * @returns {Promise<{ urls: string[], errors: string[] }>}
 */
export async function uploadMultipleToCloudinary(files, onProgress) {
	const urls = [];
	const errors = [];

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const result = await uploadToCloudinary(file, (progress) => {
			if (onProgress) onProgress(i, progress);
		});

		if (result.success && result.url) {
			urls.push(result.url);
		} else {
			errors.push(`${file.name}: ${result.error}`);
		}
	}

	return { urls, errors };
}
