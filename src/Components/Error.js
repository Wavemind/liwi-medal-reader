/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const Error = ({ message }) => {
  // Theme and style elements deconstruction
  const {
    Components: { error },
    Colors,
  } = useTheme()

  return (
    <View style={error.wrapper}>
      <Icon name="warning" color={Colors.secondary} />
      <Text style={error.message}>{message}</Text>
    </View>
  )
}

export default Error
