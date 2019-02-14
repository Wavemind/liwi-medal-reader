import { Alert } from 'react-native';

import DeviceInfo from 'react-native-device-info';

const AskGeo = async (enableHighAccuracy, callback) => {
  return navigator.geolocation.getCurrentPosition(
    async (position) => callback(position),
    async (error) => callback(error),
    {
      enableHighAccuracy: enableHighAccuracy,
      timeout: 5000,
    }
  );
};

export const GetGeo = async (cb) => {
  await AskGeo(true, async (firstCallback) => {
    if (
      firstCallback.PERMISSION_DENIED === 1 ||
      firstCallback.POSITION_UNAVAILABLE === 2
    ) {
      await AskGeo(false, (secondCallback) => {
        if (
          secondCallback.PERMISSION_DENIED === 1 ||
          secondCallback.POSITION_UNAVAILABLE === 2
        ) {
          Alert.alert(
            'Vous devez activer votre service de localisation',
            '',
            [
              {
                text: 'Annuler',
                onPress: () => {},
                style: 'cancel',
              },
              { text: 'OK', onPress: () => {} },
            ],
            { cancelable: false }
          );
          console.log('active ');
          cb(false);
        } else {
          cb(secondCallback);
        }
      });
    } else {
      cb(firstCallback);
    }
  });
};

export const GetDeviceInformations = async (cb) => {
  const manufacturer = DeviceInfo.getManufacturer();
  const deviceName = DeviceInfo.getDeviceName();
  const model = DeviceInfo.getModel();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const timezone = DeviceInfo.getTimezone();
  const version = DeviceInfo.getVersion();

  //let reference_number = Platform.OS === 'ios' ? uniqueId : serialNumber;

  let mac = await DeviceInfo.getMACAddress();
  return GetGeo((geo) => {
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
