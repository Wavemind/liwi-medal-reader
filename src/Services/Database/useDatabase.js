/**
 * The external imports
 */

/**
 * The internal imports
 */

import RemoteInterface from './Remote/useRemoteInterface'
import LocalInterface from './Local/useLocalInterface'
import { store } from '@/Store'

export default function () {
  const state = store.getState()
  const architecture = state.healthFacility.item.architecture
  const isConnected = state.network?.isConnected

  if (architecture === 'standalone' || !isConnected) {
    return LocalInterface()
  } else {
    return RemoteInterface()
  }
}
