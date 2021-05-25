/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'

/**
 * The internal imports
 */
import SideBarItem from './SideBarItem'
import { useTheme } from '@/Theme'
import { Config } from '@/Config'

const SideBar = ({ stageIndex }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  const scrollRef = useRef()

  // Will scroll to the right tab when moving between stages
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
