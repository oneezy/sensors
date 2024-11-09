// sensors.svelte.js
import { browser } from '$app/environment';

const sensorMap = {
	// Sensor Name: Sensor API Type or Availability Function
	Geolocation: checkGeolocation,
	Accelerometer: 'Accelerometer',
	LinearAccelerationSensor: 'LinearAccelerationSensor',
	GravitySensor: 'GravitySensor',
	Gyroscope: 'Gyroscope',
	Magnetometer: 'Magnetometer',
	UncalibratedMagnetometer: 'UncalibratedMagnetometer',
	AbsoluteOrientationSensor: 'AbsoluteOrientationSensor',
	RelativeOrientationSensor: 'RelativeOrientationSensor',
	AmbientLightSensor: 'AmbientLightSensor',
	PressureSensor: 'PressureSensor',
	ProximitySensor: 'ProximitySensor',
	DeviceMotionEvent: checkMotion,
	DeviceOrientationEvent: checkOrientation,
	Battery: checkBattery
	// Add other sensors as needed
};

export function sensor(sensorName, callback) {
	if (!browser) {
		// On the server, do nothing
		return;
	}

	const sensorEntry = sensorMap[sensorName];
	if (!sensorEntry) {
		callback(false, null);
		return;
	}

	if (typeof sensorEntry === 'string') {
		// It's a sensor API type
		return checkSensors(sensorEntry, callback);
	} else if (typeof sensorEntry === 'function') {
		// It's a function
		return sensorEntry(callback);
	} else {
		callback(false, null);
	}
}

export function checkSensors(sensorType, callback) {
	if (sensorType in window) {
		try {
			const sensor = new window[sensorType]();
			sensor.addEventListener('error', (event) => {
				if (event.error.name === 'NotAllowedError') {
					console.log(`Permission to access ${sensorType} was denied.`);
					callback(false, null);
				} else if (event.error.name === 'NotReadableError') {
					console.log(`Cannot connect to the ${sensorType}.`);
					callback(false, null);
				}
			});
			sensor.addEventListener('reading', () => {
				// Collect all properties
				const data = {};
				for (const key in sensor) {
					if (typeof sensor[key] !== 'function') {
						data[key] = sensor[key];
					}
				}
				// Update the data through the callback
				callback(true, data);
			});
			sensor.start();

			// Return the sensor instance for cleanup later
			return sensor;
		} catch (error) {
			if (error.name === 'SecurityError') {
				console.log(`${sensorType} construction was blocked by the Permissions Policy.`);
				callback(false, null);
			} else if (error.name === 'ReferenceError') {
				console.log(`${sensorType} is not supported by the User Agent.`);
				callback(false, null);
			} else {
				console.error(`${sensorType} error:`, error);
				callback(false, null);
			}
		}
	} else {
		callback(false, null);
	}
}

export function checkBattery(callback) {
	if ('getBattery' in navigator) {
		navigator
			.getBattery()
			.then((battery) => {
				function updateBatteryInfo() {
					const data = {};
					for (const key in battery) {
						const value = battery[key];
						// Exclude event handler properties (starting with 'on') and functions
						if (
							typeof value !== 'function' &&
							!key.startsWith('on') // Exclude properties like 'onchargingchange'
						) {
							data[key] = value;
						}
					}
					// Call the callback to update the data
					callback(true, data);
				}

				// Update battery info initially
				updateBatteryInfo();

				// Set up event listeners to update data when properties change
				battery.addEventListener('chargingchange', updateBatteryInfo);
				battery.addEventListener('levelchange', updateBatteryInfo);
				battery.addEventListener('chargingtimechange', updateBatteryInfo);
				battery.addEventListener('dischargingtimechange', updateBatteryInfo);

				// Return a cleanup function
				return () => {
					battery.removeEventListener('chargingchange', updateBatteryInfo);
					battery.removeEventListener('levelchange', updateBatteryInfo);
					battery.removeEventListener('chargingtimechange', updateBatteryInfo);
					battery.removeEventListener('dischargingtimechange', updateBatteryInfo);
				};
			})
			.catch(() => {
				callback(false, null);
			});
	} else {
		callback(false, null);
	}
}

export function checkGeolocation(callback) {
	if ('geolocation' in navigator) {
		// Request permission to access location
		navigator.permissions
			.query({ name: 'geolocation' })
			.then((result) => {
				if (result.state === 'granted' || result.state === 'prompt') {
					// Start watching the position
					const watchId = navigator.geolocation.watchPosition(
						(position) => {
							// Extract position data
							const data = {
								timestamp: position.timestamp,
								coords: {
									latitude: position.coords.latitude,
									longitude: position.coords.longitude,
									altitude: position.coords.altitude,
									accuracy: position.coords.accuracy,
									altitudeAccuracy: position.coords.altitudeAccuracy,
									heading: position.coords.heading,
									speed: position.coords.speed,
									speedKph: position.coords.speed
										? (position.coords.speed * 3.6).toFixed() + ' /kph'
										: null, // Convert to kph
									speedMph: position.coords.speed
										? (position.coords.speed * 2.23694).toFixed() + ' /mph'
										: null // Convert to mph
								}
							};
							// Call the callback with available = true and data
							callback(true, data);
						},
						(error) => {
							console.error('Geolocation error:', error);
							callback(false, null);
						},
						{
							enableHighAccuracy: true,
							maximumAge: 0,
							timeout: Infinity
						}
					);

					// Return a cleanup function to stop watching the position
					return () => {
						navigator.geolocation.clearWatch(watchId);
					};
				} else {
					callback(false, null);
				}
			})
			.catch((error) => {
				console.error('Geolocation permission error:', error);
				callback(false, null);
			});
	} else {
		callback(false, null);
	}
}

export function checkMotion(callback) {
	if ('DeviceMotionEvent' in window) {
		callback(true, null);
	} else {
		callback(false, null);
	}
}

export function checkOrientation(callback) {
	if ('DeviceOrientationEvent' in window) {
		callback(true, null);
	} else {
		callback(false, null);
	}
}
