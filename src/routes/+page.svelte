<script>
	import Sensor from '$lib/sensor/Sensor.svelte';
	import Fullscreen from '$lib/fullscreen/Fullscreen.svelte';
</script>

<main class="flex h-screen flex-col items-center overflow-auto">
	<h1 class="text-4xl font-bold">Sensors</h1>
	<Sensor />
	<Fullscreen />
</main>
