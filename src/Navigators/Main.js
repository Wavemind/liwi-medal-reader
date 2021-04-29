import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { IndexExampleContainer } from '@/Containers'
import { IndexModalContainer } from '@/Containers'

const Stack = createStackNavigator()

const MainNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Home" component={IndexExampleContainer} />
      <Stack.Screen name="InfoModal" component={IndexModalContainer} />
    </Stack.Navigator>
  )
}

export default MainNavigator
