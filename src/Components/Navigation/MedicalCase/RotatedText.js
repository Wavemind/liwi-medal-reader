/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const RotatedText = ({ label }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  const array = label.split('')

  return (
    <View style={sideBar.rotatedTextWrapper}>
      {array.map(char => {
        return <Text style={sideBar.text}>{char}</Text>
      })}
    </View>
  )
}

export default RotatedText
