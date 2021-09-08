/**
 * The external imports
 */
import { getMacAddress } from 'react-native-device-info'
import {
  DocumentDirectoryPath,
  writeFile,
  unlink,
  exists,
} from 'react-native-fs'

/**
 * The internal imports
 */
import api from '@/Services/Algorithm/FetchOneApi'
import { store } from '@/Store'

export default async ({ json_version }) => {
  const macAddress = await getMacAddress()

  // TODO: Add geoloc !
  const response = await api.post('versions/retrieve_algorithm_version', {
    json_version,
    mac_address: macAddress,
  })

  // If algorithm doesn't change. Load current stored.
  if (response === undefined || response.status === 204) {
    const state = store.getState()
    const oldAlgorithm = state.algorithm.item
    return { ...oldAlgorithm, updated: false }
  }

  // // Store emergency content in file
  // const emergencyContentTargetPath = `${DocumentDirectoryPath}/emergency_content.html`

  // if (response.data.emergency_content) {
  //   const emergencyContentFileExist = await exists(emergencyContentTargetPath)
  //   if (emergencyContentFileExist) {
  //     await unlink(emergencyContentTargetPath)
  //   }
  //   await writeFile(emergencyContentTargetPath, response.data.emergency_content)
  // }

  // Regroup nodes, final diagnoses and health cares into nodes key
  const nodes = {
    ...response.data.nodes,
    ...response.data.final_diagnoses,
    ...response.data.health_cares,
  }

  // Remove useless key
  // delete response.data.emergency_content
  delete response.data.nodes
  delete response.data.final_diagnoses
  delete response.data.health_cares

  // Store algorithm
  const algorithm = {
    ...response.data,
    updated: true,
    nodes: { ...nodes },
  }

  // Write the algorithm in a file
  const algorithmTargetPath = `${DocumentDirectoryPath}/version_${algorithm.version_id}.json`
  const algorithmFileExist = await exists(algorithmTargetPath)
  if (algorithmFileExist) {
    await unlink(algorithmTargetPath)
  }
  await writeFile(algorithmTargetPath, JSON.stringify(algorithm))
  return algorithm
}
