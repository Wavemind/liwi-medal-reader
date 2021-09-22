/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'

const ErrorNavbar = ({ errors, loading, onPress }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
    FontSize,
  } = useTheme()

  const message =
    typeof errors === 'object'
      ? typeof errors.message === 'string'
        ? errors.message
        : Object.values(errors.message)[0]
      : errors

  return (
    <View style={bottomNavbar.errorContainer}>
      <View style={[Layout.fill, Layout.row]}>
        <Text style={bottomNavbar.errorText}>{message.toString()}</Text>
      </View>
      <View style={bottomNavbar.errorNextButton}>
        <SquareButton
          filled
          icon="right-arrow"
          iconAfter
          bgColor={Colors.offWhite}
          color={Colors.black}
          iconSize={FontSize.large}
          disabled={loading}
          onPress={onPress}
        />
      </View>
    </View>
  )
}

export default ErrorNavbar
