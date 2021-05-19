import React from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { TabBar } from 'react-native-tab-view'

import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'

function TabItem({ state, descriptors, navigation, position }) {
  const {
    Components: { tabItem },
    FontSize,
  } = useTheme()

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
          contentContainerStyle={tabItem.wrapper}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name

            const isFocused = state.index === index
            const isDone = state.index > index
            const isToDo = state.index < index
            const isfirstChild = index === 0

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              })
            }

            return (
              <>
                {!isfirstChild && (
                  <Icon size={FontSize.small} name="right-arrow" />
                )}
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[tabItem.tab, isFocused && tabItem.focused]}
                >
                  <Text
                    style={[
                      tabItem.text,
                      isFocused && tabItem.textFocused,
                      isToDo && tabItem.textToDo,
                    ]}
                  >
                    {label}
                  </Text>
                  {isDone && <Icon size={FontSize.small} name="alert" />}
                </TouchableOpacity>
              </>
            )
          })}
        </Animated.ScrollView>
      </View>
    </Animated.View>
  )
}
export default TabItem
