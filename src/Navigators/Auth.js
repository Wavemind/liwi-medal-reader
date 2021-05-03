import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { IndexAuthContainer } from '@/Containers'
import { SynchronizationAuthContainer } from '@/Containers'
import { PinAuthContainer } from '@/Containers'

const Stack = createStackNavigator()

const Auth = () => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Auth" component={IndexAuthContainer} />
      <Stack.Screen
        name="Synchronization"
        component={SynchronizationAuthContainer}
      />
      <Stack.Screen name="Pin" component={PinAuthContainer} />
    </Stack.Navigator>
  )
}

export default Auth
