// utils.svelte.js
import { browser } from '$app/environment';

export function sensor(sensorName) {
	if (!browser) {
		// Return a placeholder during SSR
		return null;
	}

	try {
		switch (sensorName.toLowerCase()) {
			case 'geolocation':
				return 'geolocation' in navigator;

			case 'accelerometer':
				return 'Accelerometer' in window;

			case 'gyroscope':
				return 'Gyroscope' in window;

			case 'magnetometer':
				return 'Magnetometer' in window;

			case 'ambientlight':
				return 'AmbientLightSensor' in window;

			case 'proximity':
				return 'ProximitySensor' in window;

			case 'barometer':
				return 'Barometer' in window;

			case 'heart-rate':
				return 'HeartRateSensor' in window;

			case 'fingerprint':
				return 'credentials' in navigator && 'create' in navigator.credentials;

			case 'thermometer':
				return 'Thermometer' in window;

			case 'pedometer':
				return 'Pedometer' in window;

			case 'face-recognition':
				return 'FaceDetector' in window;

			default:
				return false;
		}
	} catch (error) {
		console.error(`Error checking availability for sensor "${sensorName}":`, error);
		return false;
	}
}
