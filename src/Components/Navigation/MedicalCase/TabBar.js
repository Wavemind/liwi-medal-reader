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

function TabBar({ state, navigation }) {
  const {
    Components: { tabBar },
    Layout,
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
    <Animated.View>
      <View style={Layout.row}>
        <Animated.ScrollView
          alwaysBounceHorizontal={false}
          horizontal
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
        </Animated.ScrollView>
      </View>
    </Animated.View>
  )
}
export default TabBar
