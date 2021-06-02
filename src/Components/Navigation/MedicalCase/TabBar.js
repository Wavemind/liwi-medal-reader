/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import TabBarItem from './TabBarItem'
import ChangeAdvancement from '@/Store/MedicalCase/ChangeAdvancement'

const TabBar = ({ state, navigation, navigationState, stageIndex }) => {
  const {
    Components: { tabBar },
    Layout,
  } = useTheme()
  const scrollRef = useRef()
  const dispatch = useDispatch()

  /**
   * Update the advancement in the store every time the step / stage changes
   */
  const updateMedicalCaseStatus = async () => {
    await dispatch(
      ChangeAdvancement.action({
        newStage: stageIndex,
        newStep: navigationState.index,
      }),
    )
  }

  // Will Scroll to the right tab when moving between steps
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: navigationState.index * Math.round(heightPercentageToDP(21)),
      animated: true,
    })
  }, [navigationState.index])

  // Will update the medical case advancement
  useEffect(() => {
    updateMedicalCaseStatus()
  }, [navigationState.index, stageIndex])

  const itemStatus = index => {
    if (state.index === index) {
      return 'current'
    } else if (state.index > index) {
      return 'done'
    } else {
      return 'toDo'
    }
  }

  return (
    <View>
      <View style={Layout.row}>
        <ScrollView
          alwaysBounceHorizontal={false}
          horizontal
          ref={scrollRef}
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tabBar.wrapper}
        >
          {state.routes.map((route, index) => (
            <TabBarItem
              key={`tabBar_${index}`}
              index={index}
              status={itemStatus(index)}
              route={route}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
export default TabBar
