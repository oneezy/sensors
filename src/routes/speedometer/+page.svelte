<script>
	import Sensor from '$lib/sensor/Sensor.svelte';
	import Camera from '$lib/camera/Camera.svelte';

	const toggleFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (error) {
			console.error('Fullscreen failed', error);
		}
	};
</script>

<main class="flex h-screen flex-col items-center overflow-auto">
	<Camera />
</main>
