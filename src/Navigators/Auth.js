/**
 * The external imports
 */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

/**
 * The internal imports
 */
import {
  LoginAuthContainer,
  SynchronizeAuthContainer,
  PinAuthContainer,
  ClinicianSelectionAuthContainer,
} from '@/Containers'

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginAuthContainer} />
      <Stack.Screen name="Synchronize" component={SynchronizeAuthContainer} />
      <Stack.Screen name="Pin" component={PinAuthContainer} />
      <Stack.Screen
        name="ClinicianSelection"
        component={ClinicianSelectionAuthContainer}
      />
    </Stack.Navigator>
  )
}

export default AuthNavigator
