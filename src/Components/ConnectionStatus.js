/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Icon } from '@/Components'

const ConnectionStatus = props => {
  // Get values from the store
  const network = useSelector(state => state.network)
  const architecture = useSelector(
    state => state.healthFacility.item.architecture,
  )

  useEffect(() => {
    if (network.isConnected && architecture === 'client-server') {
      // TODO: resend case did in fail safe mode
      console.log('TODO: fail safe action')
    }
  }, [network])

  return network.isConnected ? (
    <Icon name="wifi-on" />
  ) : (
    <Icon name="wifi-off" />
  )
}

export default ConnectionStatus
