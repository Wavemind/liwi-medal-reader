/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ConnectionStatus = props => {
  // Props deconstruction
  const { navigation, label } = props

  // Theme and style elements deconstruction

  // Get values from the store
  const network = useSelector(state => state.network)

  //  TODO: FAIRE UNE ACTION LORS DU CHANGEMENT DE STATUS

  const {
    Components: { template },
    Layout,
  } = useTheme()

  // Local state definition

  return network.isConnected ? (
    <Icon name="wifi-on" />
  ) : (
    <Icon name="wifi-off" />
  )
}

export default ConnectionStatus
