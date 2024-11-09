<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { sensor } from '$lib/sensor/sensors.svelte.js';
	import Fullscreen from '$lib/fullscreen/Fullscreen.svelte';

	let videoElement;
	let stream;
	let error = null;

	// Variable for speed in mph
	let geolocationData = null;
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
				if (available && data) {
					geolocationData = data;

					// Perform speed conversion here
					const speedMps = data.coords.speed; // Speed in meters per second
					if (speedMps !== null && !isNaN(speedMps)) {
						speedMph = (speedMps * 2.23694).toFixed(2); // Convert to mph
					} else {
						speedMph = null;
					}
				} else {
					geolocationData = null;
					speedMph = null;
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
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			class="absolute inset-0 h-screen w-screen object-cover"
		>
			<track kind="captions" />
		</video>
		<div class="overlay h-100 w-100 absolute inset-0 flex items-center justify-center">
			<!-- Display speedMph here -->
			<p class="speed">{speedMph !== null ? `${speedMph} MPH` : '0 MPH'}</p>
		</div>
		<Fullscreen />
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
		overflow: hidden;
	}
	.overlay {
		width: 100%;
		color: #fff;
		padding: 10px;
		/* Additional styling as needed */
	}
</style>
