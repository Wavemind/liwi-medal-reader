import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { IndexAuthContainer } from '@/Containers'

const Stack = createStackNavigator()

const Auth = () => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Auth" component={IndexAuthContainer} />
    </Stack.Navigator>
  )
}

export default Auth
