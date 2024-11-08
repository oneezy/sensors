<script>
	import { browser } from '$app/environment';
	import { sensor } from '$lib/utils/utils.svelte.js';

	const sensors = [
		{ name: 'geolocation', description: 'Provides location data.' },
		{ name: 'accelerometer', description: 'Measures acceleration forces.' },
		{ name: 'gyroscope', description: "Detects the device's orientation." },
		{ name: 'magnetometer', description: 'Measures magnetic fields for compass.' },
		{ name: 'ambientlight', description: 'Measures the light in the environment.' },
		{ name: 'proximity', description: 'Detects when something is close to the screen.' },
		{ name: 'barometer', description: 'Measures atmospheric pressure.' },
		{ name: 'heart-rate', description: 'Monitors your heart rate.' },
		{ name: 'fingerprint', description: 'For biometric authentication.' },
		{ name: 'thermometer', description: 'Measures the temperature of the device.' },
		{ name: 'pedometer', description: 'Counts your steps.' },
		{ name: 'face-recognition', description: 'For biometric facial recognition.' },

		{ name: 'linearaccelerationsensor', description: 'Measures linear acceleration.' },
		{ name: 'gravitysensor', description: 'Measures gravitational force.' },
		{
			name: 'uncalibratedmagnetometer',
			description: 'Measures magnetic fields without calibration.'
		},
		{ name: 'absolutedorientation', description: 'Provides absolute orientation data.' },
		{ name: 'relativeorientation', description: 'Provides relative orientation data.' },
		{ name: 'devicemotion', description: 'Provides motion data.' },
		{ name: 'deviceorientation', description: 'Provides orientation data.' },
		{ name: 'battery', description: 'Provides battery status.' }
	];

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
			<code class={sensorAvailabilities[name] ? 'text-green-600' : 'text-red-600'}>
				{#if sensorAvailabilities[name] === null}
					Checking...
				{:else}
					{sensorAvailabilities[name]}
				{/if}
			</code>
		</li>
	{/each}
</ul>
