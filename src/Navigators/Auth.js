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
  SynchronizationAuthContainer,
  PinAuthContainer,
  ClinicianSelectionAuthContainer,
} from '@/Containers'

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Auth" component={LoginAuthContainer} />
      <Stack.Screen
        name="Synchronization"
        component={SynchronizationAuthContainer}
      />
      <Stack.Screen name="Pin" component={PinAuthContainer} />
      <Stack.Screen
        name="ClinicianSelection"
        component={ClinicianSelectionAuthContainer}
      />
    </Stack.Navigator>
  )
}

export default AuthNavigator
