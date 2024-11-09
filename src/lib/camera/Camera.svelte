<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { sensor } from '$lib/sensor/sensors.svelte.js';

	let videoElement;
	let stream;
	let error = null;

	// Variable for speed in mph
	let speedMph = null;

	// Reference for cleanup
	let geolocationCleanup;

	onMount(async () => {
		if (browser) {
			// Access the camera
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'user' }
				});

				if (videoElement) {
					videoElement.srcObject = stream;
					await videoElement.play();
				}
			} catch (err) {
				console.error('Error accessing camera:', err);
				error = err;
			}

			// Initialize geolocation sensor
			geolocationCleanup = sensor('Geolocation', (available, data) => {
				if (available && data !== null) {
					speedMph = data;
				} else {
					speedMph = 'Speed not available';
				}
			});
		} else {
			error = new Error('Browser not supported');
		}
	});

	onDestroy(() => {
		// Stop the video stream
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		// Cleanup geolocation
		if (geolocationCleanup && typeof geolocationCleanup === 'function') {
			geolocationCleanup();
		}
	});
</script>

{#if error}
	<p>Error: {error.message}</p>
{:else}
	<div class="camera-container flex items-center justify-center">
		<video bind:this={videoElement} autoplay playsinline>
			<track kind="captions" />
		</video>
		<div class="overlay h-100 w-100 absolute inset-0 flex items-center justify-center">
			<!-- Display speedMph here -->
			<p class="speed">{speedMph !== null ? `${speedMph.toFixed(2)} MPH` : '0 MPH'}</p>
		</div>
	</div>
{/if}

<style>
	.speed {
		font-size: 10vw;
		font-weight: 900;
	}
	.camera-container {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	video {
		width: 100%;
		height: 100%;
		height: auto;
	}
	.overlay {
		width: 100%;
		color: #fff;
		padding: 10px;
		/* Additional styling as needed */
	}
</style>
