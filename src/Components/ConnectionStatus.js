/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import SynchronizeFailSafe from '@/Store/MedicalCase/SynchronizeFailSafe'

const ConnectionStatus = () => {
  // Get values from the store
  const dispatch = useDispatch()
  const isConnected = useSelector(state => state.network.isConnected)
  const architecture = useSelector(
    state => state.healthFacility.item.architecture,
  )

  useEffect(() => {
    async function synchronizePatients() {
      if (isConnected && architecture === 'client_server') {
        dispatch(SynchronizeFailSafe.action())
      }
    }
    synchronizePatients()
  }, [isConnected])

  return isConnected ? <Icon name="wifi-on" /> : <Icon name="wifi-off" />
}

export default ConnectionStatus
