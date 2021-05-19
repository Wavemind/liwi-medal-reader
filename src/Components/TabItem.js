import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

function TabItem({ state, descriptors, navigation, position }) {
  const {
    Components: { tabItem },
  } = useTheme()

  return (
    <View style={tabItem.wrapper}>
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

        const inputRange = state.routes.map((_, i) => i)

        return (
          <>
            <Icon name="right-arrow" />
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
              {isDone && <Icon name="alert" />}
            </TouchableOpacity>
          </>
        )
      })}
    </View>
  )
}
export default TabItem
