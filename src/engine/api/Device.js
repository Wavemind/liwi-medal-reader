import DeviceInfo from 'react-native-device-info';
import { getItem } from './LocalStorage';

// Return device information and his location
export const getDeviceInformation = async () => {
  const manufacturer = DeviceInfo.getManufacturer();
  const deviceName = DeviceInfo.getDeviceName();
  const model = DeviceInfo.getModel();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const timezone = DeviceInfo.getTimezone();
  const version = DeviceInfo.getVersion();
  let mac = await DeviceInfo.getMACAddress();

  const location = await getItem('location');

  let objReturned = {
    activity: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
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
  };

  return objReturned;
};
