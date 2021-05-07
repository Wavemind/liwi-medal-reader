/**
 * The external imports
 */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

/**
 * The internal imports
 */
import { IndexExampleContainer } from '@/Containers'

const Stack = createStackNavigator()

const MainNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Home" component={IndexExampleContainer} />
    </Stack.Navigator>
  )
}

export default MainNavigator
