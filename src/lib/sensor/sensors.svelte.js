import { browser } from '$app/environment';

// Import sensors array
// import { sensors } from './sensors.js';

const sensorMap = {
	// Sensor Name: Sensor API Type or Availability Function
	Geolocation: checkGeolocationAvailability,
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
	DeviceMotionEvent: checkDeviceMotionAvailability,
	DeviceOrientationEvent: checkDeviceOrientationAvailability,
	Battery: checkBatteryAvailability
	// Add other sensors as needed
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
		checkGenericSensorAvailability(sensorEntry, callback);
	} else if (typeof sensorEntry === 'function') {
		// It's a function
		sensorEntry(callback);
	} else {
		callback(false);
	}
}

function checkGenericSensorAvailability(sensorType, callback) {
	if (sensorType in window) {
		try {
			const sensor = new window[sensorType]();
			sensor.addEventListener('error', (event) => {
				if (event.error.name === 'NotAllowedError') {
					console.log(`Permission to access ${sensorType} was denied.`);
					callback(false);
				} else if (event.error.name === 'NotReadableError') {
					console.log(`Cannot connect to the ${sensorType}.`);
					callback(false);
				}
			});
			sensor.addEventListener('reading', () => {
				callback(true);
				sensor.stop();
			});
			sensor.start();
		} catch (error) {
			if (error.name === 'SecurityError') {
				console.log(`${sensorType} construction was blocked by the Permissions Policy.`);
				callback(false);
			} else if (error.name === 'ReferenceError') {
				console.log(`${sensorType} is not supported by the User Agent.`);
				callback(false);
			} else {
				console.error(`${sensorType} error:`, error);
				callback(false);
			}
		}
	} else {
		callback(false);
	}
}

function checkGeolocationAvailability(callback) {
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

function checkDeviceMotionAvailability(callback) {
	if ('DeviceMotionEvent' in window) {
		callback(true);
	} else {
		callback(false);
	}
}

function checkDeviceOrientationAvailability(callback) {
	if ('DeviceOrientationEvent' in window) {
		callback(true);
	} else {
		callback(false);
	}
}

function checkBatteryAvailability(callback) {
	if ('getBattery' in navigator) {
		navigator
			.getBattery()
			.then(() => {
				callback(true);
			})
			.catch(() => {
				callback(false);
			});
	} else {
		callback(false);
	}
}
