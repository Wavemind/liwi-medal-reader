/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  mkdir,
  unlink,
  writeFile,
  exists,
} from 'react-native-fs'
import { zip } from 'react-native-zip-archive'
import { checkInternetConnection } from 'react-native-offline'
import * as Keychain from 'react-native-keychain'
import { showMessage } from 'react-native-flash-message'
import uuid from 'react-native-uuid'
import ReactNativeBlobUtil from 'react-native-blob-util'

/**
 * The internal imports
 */
import i18n from '@/Translations/index'
import { store } from '@/Store'
import { RefreshTokenAuthService } from '@/Services/Auth'
import UpdateDatabaseMedicalCase from '@/Store/DatabaseMedicalCase/Update'
import ChangeStatus from '@/Store/Synchronization/ChangeStatus'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { GetNonSynchronizedService } from '@/Services/MedicalCase'
import LocalInterface from '@/Services/Database/Local/useLocalInterface'

/**
 * Transforms file path into usable path
 * @param path
 * @returns {*}
 */
const normalizeFilePath = path =>
  path.startsWith('file://') ? path.slice(7) : path

/**
 * Create json file with medical case, patient and activities
 * @param {Array} medicalCase
 * @param {String} folder
 */
const createJSON = async (medicalCase, folder) => {
  let medicalCaseJson = {}
  const patient = await LocalInterface().findBy(
    'Patient',
    medicalCase.patient.id,
  )
  const activities = await LocalInterface().getActivities(medicalCase.id)

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
}

export default async () => {
  const state = store.getState()
  const mainDataUrl = state.auth.medAlDataURL

  // Clear messages
  await store.dispatch(
    ChangeStatus.action({
      newSatus: i18n.t('containers.synchronization.status.file_generations'),
    }),
  )

  // Clear zip directory
  const medicalCaseDirectoryExist = await exists(
    `${DocumentDirectoryPath}/medical_cases`,
  )

  if (medicalCaseDirectoryExist) {
    await unlink(`${DocumentDirectoryPath}/medical_cases`)
  }

  // Get all nonsync case
  const medicalCasesNotSync = await GetNonSynchronizedService()

  // Create directories
  let zipPaths = {}
  let groupedMedicalCaseIds = []
  let folders = []
  const folderAmount = Math.ceil(medicalCasesNotSync.length / 5)
  await Promise.all(
    [...Array(folderAmount)].map(_i => {
      folder = `${DocumentDirectoryPath}/medical_cases/${uuid.v4()}`
      folders.push(folder)
      return mkdir(folder)
    }),
  )

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Setup default folder
  let folder = folders[0]
  let targetPath = `${DocumentDirectoryPath}/medical_cases/${uuid.v4()}.zip`
  let index = 0

  // Create files and generate zip file
  for await (let medicalCase of medicalCasesNotSync) {
    await createJSON(medicalCase, folder)
    groupedMedicalCaseIds.push(medicalCase.id)
    if ((index + 1) % 5 === 0 || index === medicalCasesNotSync.length - 1) {
      try {
        // Generate archive
        const path = await zip([normalizeFilePath(folder)], targetPath)
        zipPaths = { ...zipPaths, [path]: groupedMedicalCaseIds }
      } catch (error) {
        return Promise.reject({
          message: i18n.t('errors.zip.archived'),
        })
      }
      // Create new folder for next directory
      targetPath = `${DocumentDirectoryPath}/medical_cases/${uuid.v4()}.zip`
      folder = folders[Math.floor(index / 5) + 1]
      groupedMedicalCaseIds = []
    }
    index++
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Test if medAL-Data is reachable.
  const isConnected = await checkInternetConnection(mainDataUrl)

  // If it's not stop synchronization
  if (!isConnected) {
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

  let zipIndex = 1

  // Upload process
  for await (let path of Object.keys(zipPaths)) {
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
    ).catch(err => Promise.reject({ message: JSON.stringify(err) }))

    if (requestResult !== null && requestResult.respInfo.status === 200) {
      await store.dispatch(
        ChangeStatus.action({
          newSatus: i18n.t('containers.synchronization.status.zip_send', {
            zip: zipIndex,
            totalZip: Object.keys(zipPaths).length,
          }),
        }),
      )
      for await (let medicalCaseId of zipPaths[path]) {
        await store.dispatch(
          UpdateDatabaseMedicalCase.action({
            medicalCaseId: medicalCaseId,
            fields: [{ name: 'synchronizedAt', value: new Date().getTime() }],
          }),
        )
      }
      zipIndex++
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
      let message = ''

      if (requestResult.data) {
        message = requestResult.data
      } else {
        const jsonResponse = await requestResult.json()
        message = jsonResponse
      }

      return Promise.reject({ message })
    }
  }
}
