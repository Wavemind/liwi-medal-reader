/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import SideBarItem from './SideBarItem'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Config } from '@/Config'

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
        {Config.NAVIGATION.INTERVENTION_STAGES.map((stage, index) => (
          <SideBarItem stage={stage} index={index} />
        ))}
      </ScrollView>
    </View>
  )
}

export default SideBar
