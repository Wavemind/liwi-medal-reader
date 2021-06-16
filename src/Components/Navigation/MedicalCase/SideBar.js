/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

/**
 * The internal imports
 */
import SideBarItem from './SideBarItem'
import { useTheme } from '@/Theme'
import { getStages } from '@/Utils/ArmControl/GetStages'

const SideBar = ({ stageIndex }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  const scrollRef = useRef()

  // Will scroll to the right tab when moving between stages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: stageIndex * Math.round(widthPercentageToDP(46.7)),
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
        {getStages().map((stage, index) => (
          <SideBarItem key={`sidebar_${index}`} stage={stage} index={index} />
        ))}
      </ScrollView>
    </View>
  )
}

export default SideBar
