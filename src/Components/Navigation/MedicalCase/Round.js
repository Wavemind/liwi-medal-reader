/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Round = ({ active }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  return (
    <View style={sideBar.circle}>
      {active && <View style={sideBar.circleInner} />}
    </View>
  )
}
export default Round
