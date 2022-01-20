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
import axios from 'axios'
import { unzip } from 'react-native-zip-archive'
import ReactNativeBlobUtil from 'react-native-blob-util'

/**
 * The internal imports
 */
import api from '@/Services'
import { store } from '@/Store'
import { Config } from '@/Config'
import { RefreshTokenAuthService } from '@/Services/Auth'

export default async ({ json_version = '' }) => {
  // TODO: CLEAR WHEN ALL DATA IS UP TO DATE WItH ZIP
  const state = store.getState()
  const abort = axios.CancelToken.source()

  const timeout = setTimeout(() => {
    const oldAlgorithm = store.getState().algorithm.item
    abort.cancel()
    return { ...oldAlgorithm, updated: false }
  }, Config.TIMEOUT)

  let response
  let data

  await api
    .get(`algorithm?json_version=${json_version}`, {
      cancelToken: abort.token,
    })
    .then(result => {
      // Clear The Timeout
      clearTimeout(timeout)
      response = result
      data = result.data
    })

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // If algorithm doesn't change. Load current stored.
  if (response.status === 204) {
    const oldAlgorithm = state.algorithm.item
    return { ...oldAlgorithm, updated: false }
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
        `${mainDataUrl}/api/v1/algorithm?json_version=${json_version}`,
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
    const targetPath = `${DocumentDirectoryPath}/tmp_algorithm_zip`
    await mkdir(targetPath)
    const unzipPath = await unzip(zipResponse.path(), targetPath)

    const zipContent = await readFile(unzipPath + '/content.json')
    data = JSON.parse(zipContent)

    await unlink(unzipPath)
    /////////////////////////////////////////////////////
  }

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

  // Store algorithm
  const algorithm = {
    ...data,
    updated: true,
    nodes: { ...nodes },
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
