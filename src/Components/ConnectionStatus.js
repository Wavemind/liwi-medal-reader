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
  const network = useSelector(state => state.network)
  const architecture = useSelector(
    state => state.healthFacility.item.architecture,
  )

  useEffect(async () => {
    if (network.isConnected && architecture === 'client_server') {
      const patients = await LocalInterface().getAll('Patient')
      await RemoteInterface().synchronizePatients(patients)
    }
  }, [network])

  return network.isConnected ? (
    <Icon name="wifi-on" />
  ) : (
    <Icon name="wifi-off" />
  )
}

export default ConnectionStatus
