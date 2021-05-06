import { getMacAddress } from 'react-native-device-info'
import { DocumentDirectoryPath, writeFile } from 'react-native-fs'

import api from '@/Services'
import { store } from '@/Store'

export default async ({ json_version }) => {
  const macAddress = await getMacAddress()

  // TODO: Add geoloc !
  const response = await api.post('versions/retrieve_algorithm_version', {
    json_version,
    mac_address: macAddress,
  })

  // If algorithm doesn't change. Load current stored.
  if (response.status === 204) {
    const state = store.getState()
    const oldAlgorithm = state.algorithm.item

    return oldAlgorithm
  }

  // Store emergency content in file
  const targetPath = `${DocumentDirectoryPath}/emergency_content.html`
  await writeFile(targetPath, response.data.emergency_content)

  // Regroup nodes, final diagnostics and health cares into nodes key
  const nodes = {
    ...response.data.nodes,
    ...response.data.final_diagnostics,
    ...response.data.health_cares,
  }

  // Remove useless key
  delete response.data.emergency_content
  delete response.data.nodes
  delete response.data.final_diagnostics
  delete response.data.health_cares

  return {
    ...response.data,
    nodes: { ...nodes },
  }
}
