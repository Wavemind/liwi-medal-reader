import DeviceInfo from 'react-native-device-info';
import { getItem } from './LocalStorage';

// Return device information and his location
export const getDeviceInformation = async () => {
  const date = new Date();
  const brand = await DeviceInfo.getBrand();
  const deviceName = await DeviceInfo.getDeviceName();
  const model = DeviceInfo.getModel();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const timezone = date.getTimezoneOffset();
  const version = DeviceInfo.getVersion();
  const mac = await DeviceInfo.getMacAddress();

  const location = await getItem('location');

  const objReturned = {
    latitude: location?.coords?.latitude ?? null,
    longitude: location?.coords?.longitude ?? null,
    timezone,
    version,
    mac_address: mac,
    model,
    brand,
    name: deviceName,
    os: systemName,
    os_version: systemVersion,
  };

  return objReturned;
};
