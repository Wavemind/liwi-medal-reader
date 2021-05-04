import api from '@/Services'
import { getMacAddress } from 'react-native-device-info'

export default async ({ json_version }) => {
  const macAddress = await getMacAddress()

  // TODO: Add geoloc !
  const response = await api.post('versions/retrieve_algorithm_version', {
    json_version,
    mac_address: macAddress,
  })

  return response.data
}
