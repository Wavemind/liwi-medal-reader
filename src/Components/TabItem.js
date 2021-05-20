/**
 * The external imports
 */
import React from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import Animated from 'react-native-reanimated'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

function TabItem({ state, descriptors, navigation, position }) {
  const { t } = useTranslation()
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
                    {t(`containers.medical_case.steps.${label}`)}
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
