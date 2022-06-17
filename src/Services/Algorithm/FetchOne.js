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
import i18n from '@/Translations/index'

export default async ({ json_version = '' }) => {
  const state = store.getState()
  const mainDataUrl = state.auth.medAlDataURL
  const oldAlgorithm = state.algorithm.item
  console.log(state)
  // Test if medAL-Data is reachable.
  const isConnected = await checkInternetConnection(mainDataUrl)

  // If it's not return previous algorithm stored
  if (!isConnected) {
    return { ...oldAlgorithm, updated: false }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Get refresh token
  const bearToken = await RefreshTokenAuthService()

  // Setup a timeout in case request take too long
  const timeout = setTimeout(() => {
    return { ...oldAlgorithm, updated: false }
  }, Config.TIMEOUT)

  const response = await ReactNativeBlobUtil.config({
    fileCache: true,
    appendExt: 'zip',
  })
    .fetch(
      'GET',
      `${mainDataUrl}/api/v1/algorithm?json_version=${json_version}`,
      {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: bearToken,
      },
    )
    .catch(err => Promise.reject({ message: `Algorithm - ${err}` }))

  clearTimeout(timeout)

  // If algorithm doesn't change. Load current stored.
  if (response === undefined || response.respInfo.status === 204) {
    return { ...oldAlgorithm, updated: false }
  }

  if (response.respInfo.status !== 200) {
    // Token revoked, so we need to logout and redirect to login screen
    if (response.respInfo.status === 401) {
      return Promise.reject({
        message: i18n.t('errors.token.description', {
          healthFacility: state.healthFacility.item.name,
          server: state.auth.medAlDataURL,
        }),
      })
    }

    console.log(response)
    return Promise.reject({
      message: i18n.t('errors.token.description', {
        healthFacility: state.healthFacility.item.name,
        server: state.auth.medAlDataURL,
      }),
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Create tmp file to process zip
  const targetPath = `${DocumentDirectoryPath}/tmp_algorithm_zip`
  await mkdir(targetPath)
  const unzipPath = await unzip(response.path(), targetPath)

  const zipContent = await readFile(unzipPath + '/content.json')
  const data = JSON.parse(zipContent)

  await unlink(unzipPath)

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Regroup nodes, final diagnoses and health cares into nodes key
  const nodes = {
    ...data.nodes,
    ...data.final_diagnoses,
    ...data.health_cares,
  }

  // Remove useless key
  delete data.nodes
  delete data.final_diagnoses
  delete data.health_cares

  // Create new algorithm key for store
  const algorithm = {
    ...data,
    updated: true,
    nodes,
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Write the algorithm in a file
  const algorithmTargetPath = `${DocumentDirectoryPath}/version_${algorithm.version_id}.json`
  const algorithmFileExist = await exists(algorithmTargetPath)

  if (algorithmFileExist) {
    await unlink(algorithmTargetPath)
  }

  await writeFile(algorithmTargetPath, JSON.stringify(algorithm))
  return algorithm
}
