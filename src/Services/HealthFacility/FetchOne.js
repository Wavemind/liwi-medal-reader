import { getMacAddress } from 'react-native-device-info'
import * as Keychain from 'react-native-keychain'

import api from '@/Services'

export default async ({}) => {
  const macAddress = await getMacAddress()

  const response = await api.get(`devices/${macAddress}`)

  // Store health facility token
  await Keychain.setInternetCredentials(
    'health_facility_token',
    'health_facility_token',
    response.data.token,
  )

  return response.data
}
