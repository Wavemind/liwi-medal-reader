import axios from 'axios'
import { showMessage } from 'react-native-flash-message'
import i18n from '@/Translations/index'
import { store } from '@/Store'

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
  timeout: 3000,
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
    const mainDataUrl = state.healthFacility.item.main_data_ip
    config.baseURL = mainDataUrl
    console.log(config)
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
    console.log(response)
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function (error) {
    if (error.response) {
      console.log('response', error.response)
      console.log('response', error.message)
      // The request was made and the server responded with a 403 status code
      // which means access_token is expired, so we try to get a new access_token
      // from the refresh_token and retry request

      // Default response
      let errorMessage = 'Response status code <> 200 (' + error.message + ')'

      // Response given by the application
      if (error.response.data) {
        errorMessage = error.response.data
      }

      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return handleError({
        message: errorMessage,
        status: error.response.status,
        data: error.response.data,
      })
    } else if (error.request) {
      console.log('error')
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
