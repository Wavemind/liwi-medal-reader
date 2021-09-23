/**
 * The external imports
 */
import { getMacAddress } from 'react-native-device-info'
import * as Keychain from 'react-native-keychain'
import axios from 'axios'

/**
 * The internal imports
 */
import api from '@/Services'
import { Config } from '@/Config'
import i18n from '@/Translations/index'

export default async ({}) => {
  const macAddress = await getMacAddress()

  const abort = axios.CancelToken.source()
  const timeout = setTimeout(() => {
    abort.cancel()
    return Promise.reject({ message: i18n.t('errors.timeout') })
  }, Config.TIMEOUT)

  let response

  await api.get(`devices/${macAddress}`).then(result => {
    // Clear The Timeout
    clearTimeout(timeout)
    response = result
  })

  // Store health facility token
  await Keychain.setInternetCredentials(
    'health_facility_token',
    'health_facility_token',
    response.data.token,
  )

  return response.data
}
