import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';


// Return device information and his location
export const getDeviceInformation = async (cb) => {
  const manufacturer = DeviceInfo.getManufacturer();
  const deviceName = DeviceInfo.getDeviceName();
  const model = DeviceInfo.getModel();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const timezone = DeviceInfo.getTimezone();
  const version = DeviceInfo.getVersion();

  let mac = await DeviceInfo.getMACAddress();
  return getGeo((geo) => {
    if (geo === false) {
      cb(false);
    }
    cb({
      activity: {
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
        timezone: timezone,
        user_id: 'null',
        version: version,
        device_attributes: {
          mac_address: mac,
          model: model,
          brand: manufacturer,
          name: deviceName,
          os: systemName,
          os_version: systemVersion,
        },
      },
    });
  });
};

// @return [Object] longitude and latitude
// Return position of device if GPS is enabled or ask user to enable it.
export const getGeo = async (cb) => {
  await askGeo(true, async (firstCallBack) => {
    if (firstCallBack.PERMISSION_DENIED === 1 || firstCallBack.POSITION_UNAVAILABLE === 2) {
      await askGeo(false, (secondCallBack) => {
        if (secondCallBack.PERMISSION_DENIED === 1 || secondCallBack.POSITION_UNAVAILABLE === 2) {
          Alert.alert(
            'Vous devez activer votre service de localisation',
            '',
            [
              {
                text: 'Annuler',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'OK', onPress: () => {}
              },
            ],
            {cancelable: false}
          );
          cb(false);
        } else {
          cb(secondCallBack);
        }
      });
    } else {
      cb(firstCallBack);
    }
  });
};

// @param [Boolean] enableHighAccuracy, [Object] callBack
// @return [Object] longitude and latitude
// Get current position of device
const askGeo = async (enableHighAccuracy, callBack) => {
  return navigator.geolocation.getCurrentPosition(
    async (position) => callBack(position),
    async (error) => callBack(error),
    {
      enableHighAccuracy: enableHighAccuracy,
      timeout: 5000,
    },
  );
};
