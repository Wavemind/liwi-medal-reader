import axios from 'axios'
import { showMessage } from 'react-native-flash-message'
import i18n from '@/Translations/index'
import { store } from '@/Store'

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
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
    const {
      clinician,
      item: { local_data_ip },
    } = state.healthFacility
    const mac_address = state.device.item.mac_address

    config.baseURL = local_data_ip
    config.headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
    }
    config.headers['mac-address'] = mac_address
    config.headers.clinician = `${clinician.first_name} ${clinician.last_name}`

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
    console.log('Response:', response)
    return response
  },
  async function (error) {
    if (error.response) {
      console.log(error.response)
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

      console.log('ici', error.response)
      return null
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return handleError({
        message: errorMessage,
        status: error.response.status,
        data: error.response.data,
      })
    } else if (error.request) {
      console.log(error.request)

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
