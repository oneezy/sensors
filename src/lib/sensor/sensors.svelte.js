import { browser } from '$app/environment';

// Import sensors array
// import { sensors } from './sensors.js';

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
};

export function sensor(sensorName, callback) {
	if (!browser) {
		// On the server, do nothing
		return;
	}

	const sensorEntry = sensorMap[sensorName];
	if (!sensorEntry) {
		callback(false);
		return;
	}

	if (typeof sensorEntry === 'string') {
		// It's a sensor API type
		checkSensors(sensorEntry, callback);
	} else if (typeof sensorEntry === 'function') {
		// It's a function
		sensorEntry(callback);
	} else {
		callback(false);
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
				// Extract all properties of the sensor instance
				const data = {};
				for (const key in sensor) {
					if (typeof sensor[key] !== 'function') {
						data[key] = sensor[key];
					}
				}
				callback(true, data);
				sensor.stop();
			});
			sensor.start();
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

export function checkGeolocation(callback) {
	if ('geolocation' in navigator) {
		navigator.permissions
			.query({ name: 'geolocation' })
			.then((result) => {
				if (result.state === 'granted' || result.state === 'prompt') {
					callback(true);
				} else {
					callback(false);
				}
			})
			.catch(() => {
				callback(false);
			});
	} else {
		callback(false);
	}
}

export function checkMotion(callback) {
	if ('DeviceMotionEvent' in window) {
		callback(true);
	} else {
		callback(false);
	}
}

export function checkOrientation(callback) {
	if ('DeviceOrientationEvent' in window) {
		callback(true);
	} else {
		callback(false);
	}
}

export function checkBattery(callback) {
	if ('getBattery' in navigator) {
		navigator
			.getBattery()
			.then((battery) => {
				const data = {};
				for (const key in battery) {
					if (typeof battery[key] !== 'function') {
						data[key] = battery[key];
					}
				}
				callback(true, data);
			})
			.catch(() => {
				callback(false, null);
			});
	} else {
		callback(false, null);
	}
}
