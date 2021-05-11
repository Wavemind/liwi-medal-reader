/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ConnectionStatus = props => {
  // Props deconstruction
  const { navigation, label } = props

  // Theme and style elements deconstruction
  const {
    Components: { template },
    Layout,
  } = useTheme()

  // Local state definition

  return <Icon name="wifi-on" />
}

export default ConnectionStatus
