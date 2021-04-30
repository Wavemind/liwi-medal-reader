import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaView, StatusBar, PermissionsAndroid } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import { IndexStartupContainer } from '@/Containers'
import { useSelector } from 'react-redux'
import { navigationRef } from '@/Navigators/Root'
import { useTheme } from '@/Theme'

const Stack = createStackNavigator()

// let MainNavigator
let AuthNavigator

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
  const applicationIsLoading = useSelector(state => state.startup.loading)

  const permissions = [
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ]

  const requestAppPermissions = async () => {
    try {
      PermissionsAndroid.requestMultiple(permissions).then(result =>
        console.log(result),
      )
    } catch (err) {
      console.warn(err)
    }
  }

  useEffect(() => {
    if (AuthNavigator == null && !applicationIsLoading) {
      // MainNavigator = require('@/Navigators/Main').default
      AuthNavigator = require('@/Navigators/Auth').default
      setIsApplicationLoaded(true)
    }
  }, [applicationIsLoading])

  // on destroy needed to be able to reset when app close in background (Android)
  useEffect(
    () => () => {
      setIsApplicationLoaded(false)
      AuthNavigator = null
    },
    [],
  )

  useEffect(() => {
    requestAppPermissions()
  }, [])

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator headerMode={'none'} mode="modal">
          <Stack.Screen name="Startup" component={IndexStartupContainer} />
          {isApplicationLoaded && AuthNavigator != null && (
            <Stack.Screen
              name="Main"
              component={AuthNavigator}
              options={{ animationEnabled: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
