<script>
	import Sensor from '$lib/sensor/Sensor.svelte';

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
	<h1 class="text-4xl font-bold">Sensors</h1>
	<Sensor />
	<button class="fixed bottom-4 right-4 bg-black text-white" onclick={toggleFullscreen}
		>Toggle Fullscreen</button
	>
</main>
