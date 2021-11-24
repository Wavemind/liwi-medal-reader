/**
 * The external imports
 */
import * as Keychain from 'react-native-keychain'
import { authorize } from 'react-native-app-auth'

/**
 * The internal imports
 */
import ChangeValueAuthSystem from '@/Store/Auth/ChangeValue'
import { Config } from '@/Config'

export default async ({ serverAddress, clientId }, { dispatch }) => {
  const { authEndpoint, tokenEndpoint } = Config.OAUTH

  const config = {
    issuer: serverAddress,
    clientId: clientId,
    redirectUrl: 'aaa://callback',
    scopes: [],
    serviceConfiguration: {
      authorizationEndpoint: serverAddress + authEndpoint,
      tokenEndpoint: serverAddress + tokenEndpoint,
    },
    dangerouslyAllowInsecureHttpRequests: true,
  }

  const response = await authorize(config)

  // Store
  await dispatch(
    ChangeValueAuthSystem.action({ key: 'medAlDataURL', value: serverAddress }),
  )

  // Store credentials
  await Keychain.setGenericPassword(serverAddress, clientId)

  await Keychain.setInternetCredentials('client_id', 'client_id', clientId)
  await Keychain.setInternetCredentials(
    'bear_token',
    'bear_token',
    response.accessToken,
  )
  await Keychain.setInternetCredentials(
    'refresh_token',
    'refresh_token',
    response.refreshToken,
  )

  return true
}
