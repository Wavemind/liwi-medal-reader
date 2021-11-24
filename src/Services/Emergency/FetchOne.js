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
import api from '@/Services'
import { store } from '@/Store'

export default async ({ emergencyContentVersion }) => {
  const response = await api.get('emergency-content', {
    emergency_content_version: emergencyContentVersion,
  })

  // If emergency content doesn't change. Load current stored.
  if (response === undefined || response.status === 204) {
    const state = store.getState()
    return state.emergency.item
  }

  // Store emergency content in file
  const emergencyContentTargetPath = `${DocumentDirectoryPath}/emergency_content.json`

  if (response.data.emergency_content) {
    const emergencyContentFileExist = await exists(emergencyContentTargetPath)
    if (emergencyContentFileExist) {
      await unlink(emergencyContentTargetPath)
    }
    await writeFile(emergencyContentTargetPath, response.data.emergency_content)
  }

  return response.data
}
