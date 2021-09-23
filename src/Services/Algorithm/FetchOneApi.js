/**
 * The external imports
 */
import axios from 'axios'
import * as Keychain from 'react-native-keychain'
import { showMessage } from 'react-native-flash-message'

/**
 * The internal imports
 */
import i18n from '@/Translations/index'
import { store } from '@/Store'
import { defineBaseUrl } from '@/Services'
import { Config } from '@/Config'

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: Config.TIMEOUT_AXIOS,
})

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
    console.log('request', config)

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
    console.log('response')
    return response
  },
  async function (error) {
    console.log('response', error)

    if (error.response) {
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
      showMessage({
        message: i18n.t('errors.offline.title'),
        description: errorMessage,
        type: 'danger',
        duration: 5000,
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
    } else {
      showMessage({
        message: i18n.t('errors.unknown.title'),
        description: i18n.t('errors.unknown.description'),
        type: 'danger',
        duration: 5000,
      })
    }
  },
)

export default instance
