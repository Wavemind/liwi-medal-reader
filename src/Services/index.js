/**
 * The external imports
 */
import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { showMessage } from 'react-native-flash-message'
import { refresh } from 'react-native-app-auth'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { navigate } from '@/Navigators/Root'
import i18n from '@/Translations/index'
import { store } from '@/Store'

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: Config.TIMEOUT_AXIOS,
})

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
 * Handles the error returned from the api
 * @param message
 * @param data
 * @param status
 * @returns {Promise<unknown>}
 */
export const handleError = ({ message, data, status }) => {
  return Promise.reject({ message, data, status })
}

instance.interceptors.request.use(
  async function (config) {
    const state = store.getState()
    const bearToken = await Keychain.getInternetCredentials('accessToken')
    const accessTokenExpirationDate = await Keychain.getInternetCredentials(
      'accessTokenExpirationDate',
    )
    config.baseURL = state.auth.medAlDataURL + '/api/v1'

    // Test if token is valid and don't need to be refreshed
    if (
      accessTokenExpirationDate.password &&
      new Date(accessTokenExpirationDate.password).getTime() >
        new Date().getTime()
    ) {
      config.headers.Authorization = `Bearer ${bearToken.password}`
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
        config.headers.Authorization = `Bearer ${response.accessToken}`
      } catch (error) {
        // error while trying to refresh access token, so disconnect
        showMessage({
          message: i18n.t('errors.offline.title', {
            serverName: 'MedAL-Data',
          }),
          description: i18n.t('errors.offline.description'),
          type: 'danger',
          duration: 5000,
        })

        await Keychain.resetInternetCredentials('accessToken')
        await Keychain.resetInternetCredentials('accessTokenExpirationDate')
        await Keychain.resetInternetCredentials('refreshToken')
        navigate('Auth', { screen: 'Login' })
      }
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function (error) {
    if (error.response) {
      // Default response
      let errorMessage = 'Response status code <> 200 (' + error.message + ')'
      // Response given by the application
      if (error.response.data.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message[0]
        } else {
          errorMessage = error.response.data.message
        }
      }

      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return handleError({
        message: errorMessage,
        status: error.response.status,
        data: error.response.data,
      })
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      showMessage({
        message: i18n.t('errors.offline.title', {
          serverName: 'MedAL-Data',
        }),
        description: i18n.t('errors.offline.description'),
        type: 'danger',
        duration: 5000,
      })

      return handleError({
        message: 'No response received (' + error.message + ')',
      })
    } else {
      // Something happened in setting up the request that triggered an Error
      showMessage({
        message: i18n.t('errors.unknown.title'),
        description: i18n.t('errors.unknown.description'),
        type: 'danger',
        duration: 5000,
      })

      return handleError({
        message: 'Unknown error (' + error.message + ')',
      })
    }
  },
)

export default instance
