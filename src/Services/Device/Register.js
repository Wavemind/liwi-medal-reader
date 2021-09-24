/**
 * The external imports
 */
import {
  getDeviceName,
  getBrand,
  getMacAddress,
  getModel,
  getSystemName,
  getSystemVersion,
  getVersion,
} from 'react-native-device-info'
import axios from 'axios'

/**
 * The internal imports
 */
import api from '@/Services'
import { Config } from '@/Config'
import i18n from '@/Translations/index'

export default async ({}) => {
  // Get device info
  const version = await getVersion()
  const macAddress = await getMacAddress()
  const model = await getModel()
  const brand = await getBrand()
  const deviceName = await getDeviceName()
  const systemName = await getSystemName()
  const systemVersion = await getSystemVersion()

  const abort = axios.CancelToken.source()
  const timeout = setTimeout(() => {
    abort.cancel()
    return Promise.reject({ message: i18n.t('errors.timeout') })
  }, Config.TIMEOUT)

  let response

  await api
    .post('devices', {
      device: {
        version,
        mac_address: macAddress,
        model,
        brand,
        name: deviceName,
        os: systemName,
        os_version: systemVersion,
      },
    })
    .then(result => {
      // Clear The Timeout
      clearTimeout(timeout)
      response = result
    })

  return response.data
}
