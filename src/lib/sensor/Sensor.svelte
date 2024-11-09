<script>
	import { browser } from '$app/environment';
	import { sensor } from './sensors.svelte.js';
	import { sensors } from './sensors.js';

	const sensorAvailabilities = $state({});

	$effect(() => {
		if (browser) {
			sensors.forEach(({ name }) => {
				// Initialize availability to null
				sensorAvailabilities[name] = null;

				// Call the sensor function with a callback to update availability
				sensor(name, (available) => {
					sensorAvailabilities[name] = available;
				});
			});
		} else {
			// On the server, set all availabilities to null
			sensors.forEach(({ name }) => {
				sensorAvailabilities[name] = null;
			});
		}
	});
</script>

<ul class="ml-4 p-4 pb-10">
	{#each sensors as { name, description }}
		<li title={description}>
			<strong>{name}:</strong>
			<code>
				{#if sensorAvailabilities[name] === null}
					<span class="text-gray-500"> Checking... </span>
				{:else}
					<span class={sensorAvailabilities[name] ? 'text-green-600' : 'text-red-600'}>
						{sensorAvailabilities[name]}
					</span>
				{/if}
			</code>
		</li>
	{/each}
</ul>
