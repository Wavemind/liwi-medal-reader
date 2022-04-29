/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  mkdir,
  unlink,
  writeFile,
} from 'react-native-fs'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { zip } from 'react-native-zip-archive'
import { checkInternetConnection } from 'react-native-offline'
import * as Keychain from 'react-native-keychain'
import { showMessage } from 'react-native-flash-message'

/**
 * The internal imports
 */
import i18n from '@/Translations/index'
import useDatabase from '../Database/useDatabase'
import { store } from '@/Store'
import { RefreshTokenAuthService } from '@/Services/Auth'
import UpdateDatabaseMedicalCase from '@/Store/DatabaseMedicalCase/Update'
import { navigateAndSimpleReset } from '@/Navigators/Root'

/**
 * Transforms file path into usable path
 * @param path
 * @returns {*}
 */
const normalizeFilePath = path =>
  path.startsWith('file://') ? path.slice(7) : path

export default async medicalCasesToSync => {
  const { getActivities, findBy } = useDatabase()
  const state = store.getState()
  const mainDataUrl = state.auth.medAlDataURL

  const folder = `${DocumentDirectoryPath}/medical_cases`
  const targetPath = `${folder}.zip`
  let medicalCaseJson = {}

  // Create directory
  await mkdir(folder)

  // Generate files
  await Promise.all(
    medicalCasesToSync.map(async medicalCase => {
      const patient = await findBy('Patient', medicalCase.patient.id)
      const activities = await getActivities(medicalCase.id)

      const tempMedicalCaseJson = {
        ...medicalCase,
        patient: { ...patient, medicalCases: [] },
        activities: activities,
      }

      delete tempMedicalCaseJson.patient.savedInDatabase

      medicalCaseJson = JSON.stringify(tempMedicalCaseJson, (_key, value) =>
        typeof value === 'undefined' ? null : value,
      )

      await writeFile(`${folder}/${medicalCase.id}.json`, medicalCaseJson)
    }),
  )

  // Generate archive
  let path = null
  try {
    path = await zip([normalizeFilePath(folder)], targetPath)
  } catch (error) {
    return Promise.reject({ message: i18n.t('errors.zip.archived') })
  }

  await Promise.all(
    medicalCasesToSync.map(async medicalCase => {
      await unlink(`${folder}/${medicalCase.id}.json`)
    }),
  )

  // Test if medAL-Data is reachable.
  const isConnected = await checkInternetConnection(mainDataUrl)

  // If it's not stop synchronization
  if (!isConnected) {
    await unlink(path)

    showMessage({
      message: i18n.t('errors.offline.title', {
        serverName: 'MedAL-Data',
      }),
      description: i18n.t('errors.offline.description'),
      type: 'danger',
      duration: 5000,
    })

    return Promise.reject({ message: i18n.t('errors.offline.description') })
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const bearToken = await RefreshTokenAuthService()

  // Upload process
  const requestResult = await ReactNativeBlobUtil.fetch(
    'POST',
    `${mainDataUrl}/api/v1/sync_medical_cases`,
    {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: bearToken,
    },
    [
      {
        name: 'file',
        filename: 'file.zip',
        data: ReactNativeBlobUtil.wrap(path),
      },
    ],
  )
    .uploadProgress((written, total) => {
      console.log('uploaded', written / total)
    })
    .catch(err => {
      return Promise.reject({ message: err })
    })

  if (requestResult !== null && requestResult.respInfo.status === 200) {
    await unlink(path)

    // Reset medicalCases to sync if request success
    medicalCasesToSync.forEach(async medicalCase => {
      await store.dispatch(
        UpdateDatabaseMedicalCase.action({
          medicalCaseId: medicalCase.id,
          fields: [{ name: 'synchronizedAt', value: new Date().getTime() }],
        }),
      )
    })
  } else if (requestResult.respInfo.status === 401) {
    // device token revoke, so disconnect
    showMessage({
      message: i18n.t('errors.token.title'),
      description: i18n.t('errors.token.description'),
      type: 'danger',
      duration: 5000,
    })

    // Remove tokens
    await Keychain.resetInternetCredentials('accessToken')
    await Keychain.resetInternetCredentials('accessTokenExpirationDate')
    await Keychain.resetInternetCredentials('refreshToken')

    // Ask user to enrol again
    navigateAndSimpleReset('Auth', { screen: 'Login' })

    return Promise.reject({ message: i18n.t('errors.token.description') })
  } else {
    return Promise.reject({ message: requestResult.data })
  }
}
