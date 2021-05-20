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

  const array = label.split('')

  return (
    <View style={sideBar.rotatedTextWrapper}>
      {array.map(char => {
        return (
          <Text
            style={[
              sideBar.text,
              status === 'current' && sideBar.textCurent,
              status === 'notDone' && sideBar.textNotDone,
            ]}
          >
            {char}
          </Text>
        )
      })}
    </View>
  )
}

export default RotatedText
