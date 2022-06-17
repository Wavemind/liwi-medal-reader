/**
 * The external imports
 */
import * as Keychain from 'react-native-keychain'
import { refresh } from 'react-native-app-auth'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { store } from '@/Store'

export default async (forceRefresh = false) => {
  const bearToken = await Keychain.getInternetCredentials('accessToken')

  // Force get new token
  if (forceRefresh) {
    return getRefreshToken()
  }

  const accessTokenExpirationDate = await Keychain.getInternetCredentials(
    'accessTokenExpirationDate',
  )

  // Check token validity before getting new one
  if (
    accessTokenExpirationDate.password &&
    new Date(accessTokenExpirationDate.password).getTime() >
      new Date().getTime()
  ) {
    return `Bearer ${bearToken.password}`
  } else {
    return getRefreshToken()
  }
}

/**
 * Generate config based on user selection
 * @returns hash of OAuth config
 */
const createConfig = async () => {
  const state = store.getState()
  const serverAddress = state.auth.medAlDataURL
  const { authEndpoint, tokenEndpoint } = Config.OAUTH
  const clientId = await Keychain.getInternetCredentials('client_id')

  return {
    issuer: serverAddress,
    clientId: clientId.password,
    redirectUrl: 'aaa://callback',
    scopes: [],
    serviceConfiguration: {
      authorizationEndpoint: serverAddress + authEndpoint,
      tokenEndpoint: serverAddress + tokenEndpoint,
    },
    dangerouslyAllowInsecureHttpRequests: true,
  }
}

/**
 * Get new access token from refresh token
 * @returns {Promise<unknown>}
 */
const getRefreshToken = async () => {
  // Token expired
  const refreshToken = await Keychain.getInternetCredentials('refreshToken')
  const newConfig = await createConfig()

  try {
    // Get new token with refresh token
    const response = await refresh(newConfig, {
      refreshToken: refreshToken.password,
    })

    // Set new access token, refresh token and token expiration date
    await Keychain.setInternetCredentials(
      'accessToken',
      'accessToken',
      response.accessToken,
    )
    await Keychain.setInternetCredentials(
      'accessTokenExpirationDate',
      'accessTokenExpirationDate',
      response.accessTokenExpirationDate,
    )
    await Keychain.setInternetCredentials(
      'refreshToken',
      'refreshToken',
      response.refreshToken,
    )

    // Reset access token and continue with requested request
    return `Bearer ${response.accessToken}`
  } catch (error) {
    // Remove tokens
    await Keychain.resetInternetCredentials('accessToken')
    await Keychain.resetInternetCredentials('accessTokenExpirationDate')
    await Keychain.resetInternetCredentials('refreshToken')

    // Ask user to enroll again
    navigateAndSimpleReset('Auth', { screen: 'Login' })
  }
}
