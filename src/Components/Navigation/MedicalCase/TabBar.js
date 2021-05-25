/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import Animated from 'react-native-reanimated'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import TabBarItem from './TabBarItem'

function TabBar(props) {
  const { state, navigation, navigationState } = props
  const {
    Components: { tabBar },
    Layout,
  } = useTheme()

  const scrollRef = useRef()

  // Will Scroll to the right tab when moving between steps
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: navigationState.index * 190,
      animated: true,
    })
  }, [navigationState.index])

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
    <Animated.View>
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
    </Animated.View>
  )
}
export default TabBar
