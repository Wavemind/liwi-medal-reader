/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import SideBarItem from './SideBarItem'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Config } from '@/Config'

const SideBar = ({ stageIndex }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  const scrollRef = useRef()

  // Will Scroll to the right tab when moving between Stages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: stageIndex * 280,
      animated: true,
    })
  }, [stageIndex])
  return (
    <View style={sideBar.wrapper}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={sideBar.container}
        showsVerticalScrollIndicator={false}
      >
        {Config.NAVIGATION.INTERVENTION_STAGES.map((stage, index) => (
          <SideBarItem key={`sidebar_${index}`} stage={stage} index={index} />
        ))}
      </ScrollView>
    </View>
  )
}

export default SideBar
