/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const RotatedText = ({ label, status }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  // Array with all the characters to show
  const array = label.split('')

  return (
    <View style={sideBar.rotatedTextWrapper}>
      {array.map((char, index) => {
        return (
          <Text key={`${label}_${index}`} style={[sideBar.text(status)]}>
            {char}
          </Text>
        )
      })}
    </View>
  )
}

export default RotatedText
