/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import TabBarItem from './TabBarItem'

function TabBar({ state, descriptors, navigation, position }) {
  const {
    Components: { tabBar },
  } = useTheme()

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
    <Animated.View
      style={{
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: {
          width: 0,
        },
        zIndex: 1,
      }}
    >
      <View style={{ overflow: 'scroll', display: 'flex' }}>
        <Animated.ScrollView
          alwaysBounceHorizontal={false}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tabBar.wrapper}
        >
          {state.routes.map((route, index) => (
            <TabBarItem
              index={index}
              status={itemStatus(index)}
              route={route}
              navigation={navigation}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </Animated.View>
  )
}
export default TabBar
