/**
 * The external imports
 */
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

export default async ({ emergencyContentVersion, algorithmId }) => {
  const response = await api.post(
    `algorithms/${algorithmId}/emergency_content`,
    {
      emergency_content_version: -1,
    },
  )

  console.log('emergency response', response)

  // If emergency content doesn't change. Load current stored.
  if (response === undefined || response.status === 204) {
    const state = store.getState()
    const oldEmergency = state.emergency.item
    return { ...oldEmergency, updated: false }
  }

  // Store emergency content in file
  const emergencyContentTargetPath = `${DocumentDirectoryPath}/emergency_content.html`

  if (response.data.emergency_content) {
    const emergencyContentFileExist = await exists(emergencyContentTargetPath)
    if (emergencyContentFileExist) {
      await unlink(emergencyContentTargetPath)
    }
    await writeFile(emergencyContentTargetPath, response.data.emergency_content)
  }

  // Store algorithm
  return {
    ...response.data,
    updated: true,
  }
}
