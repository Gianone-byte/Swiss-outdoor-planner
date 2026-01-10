<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	/**
	 * @type {{ 
	 *   centerLat?: number, 
	 *   centerLng?: number, 
	 *   zoom?: number, 
	 *   points?: Array<{lat: number, lng: number}> | null,
	 *   bounds?: { minLat: number, minLng: number, maxLat: number, maxLng: number } | null
	 * }}
	 */
	let { 
		centerLat = 47.3769, 
		centerLng = 8.5417, 
		zoom = 11, 
		points = null,
		bounds = null
	} = $props();

	/** @type {HTMLDivElement | null} */
	let mapContainer = $state(null);
	
	/** @type {any} */
	let map = null;
	
	/** @type {any} */
	let polyline = null;

	/** @type {any} */
	let L = null;

	onMount(async () => {
		if (!browser) return;

		// Dynamic import of Leaflet (SSR-safe)
		L = await import('leaflet');

		// Initialize map
		map = L.map(mapContainer, {
			scrollWheelZoom: false
		}).setView([centerLat, centerLng], zoom);

		// Add OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		// Draw polyline if points exist
		if (points && points.length > 0) {
			drawPolyline();
		}

		// Fit bounds if provided
		if (bounds) {
			fitToBounds();
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
		}
	});

	function drawPolyline() {
		if (!map || !L || !points || points.length === 0) return;

		// Remove existing polyline
		if (polyline) {
			map.removeLayer(polyline);
		}

		// Create Leaflet LatLng array
		const latLngs = points.map(p => L.latLng(p.lat, p.lng));

		// Draw polyline with styling
		polyline = L.polyline(latLngs, {
			color: '#0a5eb7',
			weight: 4,
			opacity: 0.85,
			lineCap: 'round',
			lineJoin: 'round'
		}).addTo(map);
	}

	function fitToBounds() {
		if (!map || !L || !bounds) return;

		const leafletBounds = L.latLngBounds(
			L.latLng(bounds.minLat, bounds.minLng),
			L.latLng(bounds.maxLat, bounds.maxLng)
		);

		map.fitBounds(leafletBounds, {
			padding: [30, 30],
			maxZoom: 15
		});
	}

	// Reactive updates when props change
	$effect(() => {
		if (map && L && points && points.length > 0) {
			drawPolyline();
		}
	});

	$effect(() => {
		if (map && L && bounds) {
			fitToBounds();
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
</svelte:head>

<div class="map-wrapper">
	<div bind:this={mapContainer} class="map-container"></div>
</div>

<style>
	.map-wrapper {
		width: 100%;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.map-container {
		width: 100%;
		height: 380px;
		background: #e5e7eb;
	}

	/* Fix Leaflet z-index issues in SvelteKit */
	:global(.leaflet-pane) {
		z-index: 1;
	}
	:global(.leaflet-control) {
		z-index: 2;
	}
	:global(.leaflet-top),
	:global(.leaflet-bottom) {
		z-index: 2;
	}
</style>
