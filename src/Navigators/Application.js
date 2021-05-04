import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaView, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import {
  IndexPermissionsRequiredContainer,
  IndexStartupContainer,
} from '@/Containers'
import { useSelector } from 'react-redux'
import { navigationRef } from '@/Navigators/Root'
import { useTheme } from '@/Theme'

const Stack = createStackNavigator()

// let MainNavigator
let AuthNavigator
let MainNavigator

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
  const applicationIsLoading = useSelector(state => state.startup.loading)

  useEffect(() => {
    if (AuthNavigator == null && !applicationIsLoading) {
      MainNavigator = require('@/Navigators/Main').default
      AuthNavigator = require('@/Navigators/Auth').default
      setIsApplicationLoaded(true)
    }
  }, [applicationIsLoading])

  // on destroy needed to be able to reset when app close in background (Android)
  useEffect(
    () => () => {
      setIsApplicationLoaded(false)
      AuthNavigator = null
      MainNavigator = null
    },
    [],
  )

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator headerMode="none" mode="modal">
          <Stack.Screen name="Startup" component={IndexStartupContainer} />
          <Stack.Screen
            name="PermissionsRequired"
            component={IndexPermissionsRequiredContainer}
          />
          {isApplicationLoaded && AuthNavigator != null && (
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ animationEnabled: false }}
            />
          )}
          {isApplicationLoaded && MainNavigator != null && (
            <Stack.Screen
              name="Home"
              component={MainNavigator}
              options={{ animationEnabled: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
