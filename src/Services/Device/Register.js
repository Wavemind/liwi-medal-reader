import {
  getDeviceName,
  getBrand,
  getMacAddress,
  getModel,
  getSystemName,
  getSystemVersion,
  getVersion,
} from 'react-native-device-info'

import api from '@/Services'

export default async ({}) => {
  // Get device info
  const version = await getVersion()
  const macAddress = await getMacAddress()
  const model = await getModel()
  const brand = await getBrand()
  const deviceName = await getDeviceName()
  const systemName = await getSystemName()
  const systemVersion = await getSystemVersion()

  const response = await api.post('devices', {
    device: {
      version,
      mac_address: macAddress,
      model,
      brand,
      name: deviceName,
      os: systemName,
      os_version: systemVersion,
    },
  })

  return response.data
}
