import * as Keychain from 'react-native-keychain'

import api from '@/Services'

export default async ({ email, password }) => {
  const response = await api.post('auth/sign_in', { email, password })

  // Store credentials
  await Keychain.setGenericPassword(email, password)

  await Keychain.setInternetCredentials(
    'access_token',
    'access_token',
    response.headers['access-token'],
  )

  await Keychain.setInternetCredentials(
    'client',
    'client',
    response.headers.client,
  )

  await Keychain.setInternetCredentials(
    'expiry',
    'expiry',
    response.headers.expiry,
  )

  await Keychain.setInternetCredentials('uid', 'uid', response.headers.uid)

  return response.data.data
}
