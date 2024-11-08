import { browser } from '$app/environment';

export function sensor(sensorName, callback) {
	if (!browser) {
		// On the server, do nothing
		return;
	}

	switch (sensorName.toLowerCase()) {
		// Generic Sensor API Sensors
		case 'accelerometer':
			checkGenericSensorAvailability('Accelerometer', callback);
			break;
		case 'linearaccelerationsensor':
			checkGenericSensorAvailability('LinearAccelerationSensor', callback);
			break;
		case 'gravitysensor':
			checkGenericSensorAvailability('GravitySensor', callback);
			break;
		case 'gyroscope':
			checkGenericSensorAvailability('Gyroscope', callback);
			break;
		case 'magnetometer':
			checkGenericSensorAvailability('Magnetometer', callback);
			break;
		case 'uncalibratedmagnetometer':
			checkGenericSensorAvailability('UncalibratedMagnetometer', callback);
			break;
		case 'absolutedorientation':
		case 'absolutedorientationsensor':
			checkGenericSensorAvailability('AbsoluteOrientationSensor', callback);
			break;
		case 'relativeorientation':
		case 'relativeorientationsensor':
			checkGenericSensorAvailability('RelativeOrientationSensor', callback);
			break;
		case 'ambientlight':
		case 'ambientlightsensor':
			checkGenericSensorAvailability('AmbientLightSensor', callback);
			break;
		case 'pressure':
		case 'pressuresensor':
		case 'barometer':
			checkGenericSensorAvailability('PressureSensor', callback);
			break;
		case 'proximity':
			checkGenericSensorAvailability('ProximitySensor', callback);
			break;

		// Other Sensors and APIs
		case 'geolocation':
			checkGeolocationAvailability(callback);
			break;
		case 'devicemotion':
			checkDeviceMotionAvailability(callback);
			break;
		case 'deviceorientation':
			checkDeviceOrientationAvailability(callback);
			break;
		case 'battery':
			checkBatteryAvailability(callback);
			break;

		default:
			callback(false);
	}
}

function checkGenericSensorAvailability(sensorType, callback) {
	if (sensorType in window) {
		try {
			const sensor = new window[sensorType]({ frequency: 10 });
			sensor.onerror = (event) => {
				if (event.error.name === 'NotAllowedError') {
					console.log(`Permission to access ${sensorType} was denied.`);
					callback(false);
				} else if (event.error.name === 'NotReadableError') {
					console.log(`Cannot connect to the ${sensorType}.`);
					callback(false);
				}
			};
			sensor.onreading = () => {
				callback(true);
				sensor.stop();
			};
			sensor.start();
		} catch (error) {
			if (error.name === 'SecurityError') {
				console.log(`${sensorType} construction was blocked by the Permissions Policy.`);
				callback(false);
			} else if (error.name === 'ReferenceError') {
				console.log(`${sensorType} is not supported by the User Agent.`);
				callback(false);
			} else {
				throw error;
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
