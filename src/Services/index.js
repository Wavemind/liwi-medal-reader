/**
 * The external imports
 */
import axios from 'axios'
import { showMessage } from 'react-native-flash-message'

/**
 * The internal imports
 */
import { Config } from '@/Config'

import { RefreshTokenAuthService } from '@/Services/Auth'
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
    config.baseURL = state.auth.medAlDataURL + '/api/v1'
    const bearToken = await RefreshTokenAuthService()
    config.headers.Authorization = bearToken
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

      // Avoid raise an error if request was for getting an algorithm when tablet doesn't have any internet connection
      if (error.request._url.search('algorithm') === -1) {
        return handleError({
          message: 'No response received (' + error.message + ')',
        })
      }
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
