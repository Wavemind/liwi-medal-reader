/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  writeFile,
  unlink,
  mkdir,
  exists,
  readFile,
} from 'react-native-fs'
import { unzip } from 'react-native-zip-archive'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { checkInternetConnection } from 'react-native-offline'

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import { RefreshTokenAuthService } from '@/Services/Auth'

export default async ({ emergencyContentVersion }) => {
  const state = store.getState()
  const mainDataUrl = state.auth.medAlDataURL
  const oldEmergencyContent = state.emergency.item

  // Test if medAL-Data is reachable.
  const isConnected = await checkInternetConnection(mainDataUrl)

  // If it's not return previous emergency content stored
  if (!isConnected) {
    return oldEmergencyContent
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Get refresh token
  const bearToken = await RefreshTokenAuthService()

  // Setup a timeout in case request take too long
  const timeout = setTimeout(() => {
    return oldEmergencyContent
  }, Config.TIMEOUT)

  const response = await ReactNativeBlobUtil.config({
    fileCache: true,
    appendExt: 'zip',
  })
    .fetch(
      'GET',
      `${mainDataUrl}/api/v1/emergency-content?json_version=${emergencyContentVersion}`,
      {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/zip',
        Authorization: bearToken,
      },
    )
    .catch(err => {
      return Promise.reject({ message: err })
    })

  clearTimeout(timeout)

  // If emergency content doesn't change. Load current stored.
  if (response === undefined || response.respInfo.status === 204) {
    return oldEmergencyContent
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Create tmp file to process zip
  const targetPath = `${DocumentDirectoryPath}/tmp_emergency_content_zip`
  await mkdir(targetPath)
  const unzipPath = await unzip(response.path(), targetPath)

  const zipContent = await readFile(unzipPath + '/content.json')
  const emergencyContent = JSON.parse(zipContent)

  await unlink(unzipPath)

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Store emergency content in file
  const emergencyContentTargetPath = `${DocumentDirectoryPath}/emergency_content.json`

  if (emergencyContent) {
    const emergencyContentFileExist = await exists(emergencyContentTargetPath)
    if (emergencyContentFileExist) {
      await unlink(emergencyContentTargetPath)
    }
    await writeFile(emergencyContentTargetPath, emergencyContent)
  }

  return emergencyContent
}
