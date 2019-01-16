import { Platform, Linking, Alert, Navi } from 'react-native';

import DeviceInfo from 'react-native-device-info';

export const GetGeo = async (cb) => {
  return navigator.geolocation.getCurrentPosition(
    async (position) => {
      cb(position);
    },
    async (error) => console.log(error),
    {
      enableHighAccuracy: true,
      timeout: 20000,
    }
  );
};

export const GetDeviceInformations = async (cb) => {
  const manufacturer = DeviceInfo.getManufacturer();
  const brand = DeviceInfo.getDeviceId();
  const deviceName = DeviceInfo.getDeviceName();
  const model = DeviceInfo.getModel();
  const phoneNumber = DeviceInfo.getPhoneNumber();
  const serialNumber = DeviceInfo.getSerialNumber();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const timezone = DeviceInfo.getTimezone();
  const uniqueId = DeviceInfo.getUniqueID();

  // TODO need to define the real unique id....
  //console.log(brand, deviceName, phoneNumber, serialNumber, uniqueId);

  return GetGeo((geo) => {
    cb({
      activity: {
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
        timezone: timezone,
        user_id: 'null',
        version: '',
        device_attributes: {
          reference_number: brand,
          model: model,
          brand: manufacturer,
          name: 'Constants.deviceName',
          os: systemName,
          os_version: systemVersion,
        },
      },
    });
  });
};
