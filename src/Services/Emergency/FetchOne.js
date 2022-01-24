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

/**
 * The internal imports
 */
import api from '@/Services'
import { store } from '@/Store'
import { RefreshTokenAuthService } from '@/Services/Auth'

export default async ({ emergencyContentVersion }) => {
  // TODO: CLEAR WHEN ALL DATA IS UP TO DATE WItH ZIP
  const state = store.getState()
  let emergencyContent

  const response = await api.get(
    `emergency-content?json_version=${emergencyContentVersion}`,
  )

  emergencyContent = response?.data?.emergency_content

  // If emergency content doesn't change. Load current stored.
  if (response === undefined || response.status === 204) {
    const state = store.getState()
    return state.emergency.item
  }

  if (response.headers['content-type'] === 'application/zip') {
    // ZIP FETCH
    const bearToken = await RefreshTokenAuthService()
    const mainDataUrl = state.auth.medAlDataURL

    const zipResponse = await ReactNativeBlobUtil.config({
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

    // Create tmp file to process zip
    const targetPath = `${DocumentDirectoryPath}/tmp_emergency_content_zip`
    await mkdir(targetPath)
    const unzipPath = await unzip(zipResponse.path(), targetPath)

    const zipContent = await readFile(unzipPath + '/content.json')
    emergencyContent = JSON.parse(zipContent)

    await unlink(unzipPath)
    /////////////////////////////////////////////////////
  }

  // Store emergency content in file
  const emergencyContentTargetPath = `${DocumentDirectoryPath}/emergency_content.json`

  if (emergencyContent) {
    const emergencyContentFileExist = await exists(emergencyContentTargetPath)
    if (emergencyContentFileExist) {
      await unlink(emergencyContentTargetPath)
    }
    await writeFile(emergencyContentTargetPath, emergencyContent)
  }

  return response.data
}
