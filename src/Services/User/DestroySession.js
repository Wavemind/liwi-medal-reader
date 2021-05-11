import * as Keychain from 'react-native-keychain'

import api from '@/Services'

export default async () => {
  await api.delete('auth/sign_out')

  // Destroy credentials
  await Keychain.resetInternetCredentials('access_token')
  await Keychain.resetInternetCredentials('client')
  await Keychain.resetInternetCredentials('expiry')
  await Keychain.resetInternetCredentials('uid')

  return {}
}
