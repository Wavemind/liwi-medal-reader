/**
 * The external imports
 */
import {
  DocumentDirectoryPath,
  writeFile,
  unlink,
  exists,
} from 'react-native-fs'
import axios from 'axios'

/**
 * The internal imports
 */
import api from '@/Services'
import { store } from '@/Store'
import { Config } from '@/Config'

export default async ({ json_version = '' }) => {
  const abort = axios.CancelToken.source()

  const timeout = setTimeout(() => {
    const oldAlgorithm = store.getState().algorithm.item
    abort.cancel()
    return { ...oldAlgorithm, updated: false }
  }, Config.TIMEOUT)

  let response

  await api
    .get(`algorithm?json_version=${json_version}`, {
      cancelToken: abort.token,
    })
    .then(result => {
      // Clear The Timeout
      clearTimeout(timeout)
      response = result
    })

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // If algorithm doesn't change. Load current stored.
  if (response === undefined || response.status === 204) {
    const state = store.getState()
    const oldAlgorithm = state.algorithm.item
    return { ...oldAlgorithm, updated: false }
  }

  // Regroup nodes, final diagnoses and health cares into nodes key
  const nodes = {
    ...response.data.nodes,
    ...response.data.final_diagnoses,
    ...response.data.health_cares,
  }

  // Remove useless key
  delete response.data.nodes
  delete response.data.final_diagnoses
  delete response.data.health_cares

  // Store algorithm
  const algorithm = {
    ...response.data,
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
