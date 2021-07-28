import axios from 'axios'
import { Config } from '@/Config'
import * as Keychain from 'react-native-keychain'
import { navigate } from '@/Navigators/Root'
import { showMessage } from 'react-native-flash-message'
import i18n from '@/Translations/index'
import { store } from '@/Store'

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 3000,
})

/**
 * Defines the baseURL based on the selected environment
 * @param env
 * @returns {string}
 */
const defineBaseUrl = env => {
  switch (env) {
    case 'test':
      return Config.URL_TEST_API
    case 'staging':
      return Config.URL_STAGING_API
    case 'production':
      return Config.URL_PRODUCTION_API
    default:
      return Config.URL_TEST_API
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
    const env = state.system.environment

    const accessToken = await Keychain.getInternetCredentials('access_token')
    const client = await Keychain.getInternetCredentials('client')
    const expiry = await Keychain.getInternetCredentials('expiry')
    const uid = await Keychain.getInternetCredentials('uid')
    const healthFacilityToken = await Keychain.getInternetCredentials(
      'health_facility_token',
    )
    config.baseURL = defineBaseUrl(env)
    config.headers.common['access-token'] = accessToken.password
    config.headers.common['health-facility-token'] =
      healthFacilityToken.password
    config.headers.common.client = client.password
    config.headers.common.expiry = expiry.password
    config.headers.common.uid = uid.password
    return config
  },
  function (error) {
    console.log('error request', error)
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
      const originalRequest = error.config
    
      // The request was made and the server responded with a 403 status code
      // which means access_token is expired, so we try to get a new access_token
      // from the refresh_token and retry request
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true

        const refreshToken = await Keychain.getInternetCredentials(
          'refresh_token',
        )

        const response = await instance.post('auth/refresh', {
          refresh_token: refreshToken.password,
        })

        await Keychain.setInternetCredentials(
          'access_token',
          'access_token',
          response.data.data.attributes.token,
        )

        await Keychain.setInternetCredentials(
          'refresh_token',
          'refresh_token',
          response.data.included.attributes.token,
        )

        const accessToken = {
          token: response.data.data.attributes.token,
          expiration: response.data.data.attributes.expiration,
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken.token}`
        return instance(originalRequest)
      } else if (originalRequest.url === 'auth/refresh') {
        // error while trying to refresh access token, so disconnect!!
        await Keychain.resetInternetCredentials('access_token')
        await Keychain.resetInternetCredentials('refresh_token')
        navigate('Auth', { screen: 'IndexAuth' })
      }

      // Default response
      let errorMessage = 'Response status code <> 200 (' + error.message + ')'

      // Response given by the application
      if (error.response.data.errors) {
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors[0]
        } else {
          errorMessage = error.response.data.errors
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
        message: i18n.t('errors.offline.title'),
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
