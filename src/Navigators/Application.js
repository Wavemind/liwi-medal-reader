/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaView, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ReduxNetworkProvider } from 'react-native-offline'

/**
 * The internal imports
 */
import {
  IndexModalContainer,
  IndexPermissionsRequiredContainer,
  IndexStartupContainer,
  IndexSearchContainer,
  IndexFilterContainer,
  IndexScanContainer,
} from '@/Containers'
import { useSelector } from 'react-redux'
import { navigationRef } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { Config } from '@/Config'

const Stack = createStackNavigator()

// let MainNavigator
let AuthNavigator
let MainNavigator

// @refresh reset
const ApplicationNavigator = () => {
  // Theme and style elements deconstruction
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme

  // Local state definition
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)

  // Get values from the store
  const applicationIsLoading = useSelector(state => state.startup.loading)
  const healthFacility = useSelector(state => state.healthFacility.item)

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
    <ReduxNetworkProvider
      shouldPing={healthFacility?.architecture === 'client-server'}
      pingServerUrl={healthFacility?.local_data_ip}
      pingInterval={Config.PING_INTERVAL}
    >
      <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
        <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          <Stack.Navigator headerMode="none" mode="modal">
            <Stack.Screen name="Startup" component={IndexStartupContainer} />
            <Stack.Screen
              name="PermissionsRequired"
              component={IndexPermissionsRequiredContainer}
            />
            <Stack.Screen name="InfoModal" component={IndexModalContainer} />
            <Stack.Screen name="Search" component={IndexSearchContainer} />
            <Stack.Screen name="Scan" component={IndexScanContainer} />
            <Stack.Screen name="Filter" component={IndexFilterContainer} />
            {isApplicationLoaded && AuthNavigator != null && (
              <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
            {isApplicationLoaded && MainNavigator != null && (
              <Stack.Screen name="Home" component={MainNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ReduxNetworkProvider>
  )
}

export default ApplicationNavigator
