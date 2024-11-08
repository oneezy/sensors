<script>
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
		{ name: 'face-recognition', description: 'For biometric facial recognition.' }
	];
</script>

<ul class="ml-4 p-4 pb-10">
	{#each sensors as { name, description }}
		<li title={description}>
			<strong>{name}:</strong>
			<code class={sensor(name) ? 'text-green-500' : 'text-gray-500'}>{sensor(name)}</code>
		</li>
	{/each}
</ul>
