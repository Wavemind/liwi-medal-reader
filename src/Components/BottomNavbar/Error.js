/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const ErrorNavbar = ({ errors }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
  } = useTheme()

  const message =
    typeof errors === 'object' ? Object.values(errors.message)[0] : errors

  return (
    <View style={bottomNavbar.errorContainer}>
      <View style={[Layout.fill, Layout.row]}>
        <Text style={bottomNavbar.errorText}>{message.toString()}</Text>
      </View>
    </View>
  )
}

export default ErrorNavbar
