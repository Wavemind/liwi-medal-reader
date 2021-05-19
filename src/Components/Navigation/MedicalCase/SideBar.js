/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import RotatedText from './RotatedText'
import Round from './Round'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const SideBar = props => {
  const {
    Components: { sideBar },
  } = useTheme()

  return (
    <View style={sideBar.wrapper}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <RotatedText label="Registration" />
        <Round active />
        <Round />
        <Round />
        <RotatedText label="1st assessment" />
        <RotatedText label="1st assessment" />
        <RotatedText label="1st assessment" />
      </ScrollView>
    </View>
  )
}

export default SideBar
