/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import LocalInterface from '@/Services/Database/Local/useLocalInterface'
import RemoteInterface from '@/Services/Database/Remote/useRemoteInterface'

const ConnectionStatus = () => {
  // Get values from the store
  const isConnected = useSelector(state => state.network.isConnected)
  const architecture = useSelector(
    state => state.healthFacility.item.architecture,
  )

  useEffect(async () => {
    if (isConnected && architecture === 'client_server') {
      const patients = await LocalInterface().getAll('Patient')
      if (patients.length > 0) {
        await RemoteInterface().synchronizePatients(patients)
      }
    }
  }, [isConnected])

  return isConnected ? <Icon name="wifi-on" /> : <Icon name="wifi-off" />
}

export default ConnectionStatus
