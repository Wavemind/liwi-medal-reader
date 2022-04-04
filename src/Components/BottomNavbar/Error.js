/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'

const Error = ({ errors, loading, onPress }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
    FontSize,
  } = useTheme()

  const message = useMemo(() => {
    if (typeof errors === 'object') {
      if (typeof errors.message === 'string') {
        return errors.message
      }
      return Object.values(errors.message)[0]
    }
    return errors
  }, [errors])

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

export default Error
