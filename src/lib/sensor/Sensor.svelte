<!-- Sensor.svelte -->
<script>
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { sensor } from '$lib/sensor/sensors.svelte.js';
	import { sensors } from '$lib/sensor/sensors.js';

	// Initialize sensorAvailabilities with default values
	const initialSensorAvailabilities = {};
	sensors.forEach(({ name }) => {
		initialSensorAvailabilities[name] = { available: null, data: null };
	});
	const sensorAvailabilities = $state(initialSensorAvailabilities);

	// Store references to cleanup functions
	const cleanupFunctions = {};

	$effect(() => {
		if (browser) {
			sensors.forEach(({ name }) => {
				// Call the sensor function with a callback to update availability and data
				const cleanup = sensor(name, (available, data) => {
					sensorAvailabilities[name] = { available, data };
				});

				// Store the cleanup function if it exists
				if (cleanup) {
					cleanupFunctions[name] = cleanup;
				}
			});
		}
	});

	// Cleanup when the component is destroyed
	onDestroy(() => {
		Object.values(cleanupFunctions).forEach((cleanup) => {
			cleanup();
		});
	});
</script>

<ul class="ml-4 p-4 pb-10">
	{#each sensors as { name, description }}
		<li title={description}>
			<strong>{name}:</strong>
			<code>
				{#if sensorAvailabilities[name].available === null}
					<span class="text-gray-500"> Checking... </span>
				{:else}
					<span class={sensorAvailabilities[name].available ? 'text-green-600' : 'text-red-600'}>
						{sensorAvailabilities[name].available ? true : false}
					</span>
					{#if sensorAvailabilities[name].available && sensorAvailabilities[name].data}
						<pre>{JSON.stringify(sensorAvailabilities[name].data, null, 2)}</pre>
					{/if}
				{/if}
			</code>
		</li>
	{/each}
</ul>
