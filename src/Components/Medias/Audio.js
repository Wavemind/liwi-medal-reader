/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Audio = props => {
  // Props deconstruction
  const { navigation, label } = props

  // Theme and style elements deconstruction
  const {
    Components: { template },
    Layout,
  } = useTheme()

  // Local state definition
  const [exampleState, setExampleState] = useState('')

  // Constants definition
  const exampleConstant = 2

  return (
    <View>
      <Text>Audio</Text>
    </View>
  )
}

export default Audio
