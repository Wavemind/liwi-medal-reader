/**
 * The external imports
 */
import * as Keychain from 'react-native-keychain'
import { refresh } from 'react-native-app-auth'
import { showMessage } from 'react-native-flash-message'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import i18n from '@/Translations/index'
import { store } from '@/Store'

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

export default async () => {
  const bearToken = await Keychain.getInternetCredentials('accessToken')
  const accessTokenExpirationDate = await Keychain.getInternetCredentials(
    'accessTokenExpirationDate',
  )

  // Test if token is valid and don't need to be refreshed
  if (
    accessTokenExpirationDate.password &&
    new Date(accessTokenExpirationDate.password).getTime() >
      new Date().getTime()
  ) {
    return `Bearer ${bearToken.password}`
  } else {
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
      // Error while trying to refresh access token, so disconnect
      // showMessage({
      //   message: i18n.t('errors.offline.title', {
      //     serverName: 'MedAL-Data',
      //   }),
      //   description: i18n.t('errors.offline.description'),
      //   type: 'danger',
      //   duration: 5000,
      // })

      // TODO: REMOVE WHEN TESTING IS DONE !
      showMessage({
        message: 'Refresh token error',
        description: JSON.parse(error),
        type: 'danger',
        duration: 15000,
      })

      // Remove tokens
      await Keychain.resetInternetCredentials('accessToken')
      await Keychain.resetInternetCredentials('accessTokenExpirationDate')
      await Keychain.resetInternetCredentials('refreshToken')

      // Ask user to enrol again
      navigateAndSimpleReset('Auth', { screen: 'Login' })
    }
  }
}
