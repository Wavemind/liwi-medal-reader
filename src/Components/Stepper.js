/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

/**
 * The internal imports
 */
import { IndexConsultationContainer, IndexHomeContainer } from '@/Containers'

const Stepper = props => {
  // Props deconstruction
  const { navigation, label } = props
  const Tab = createMaterialTopTabNavigator()

  // Theme and style elements deconstruction

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={IndexConsultationContainer} />
      <Tab.Screen name="Settings" component={IndexHomeContainer} />
    </Tab.Navigator>
  )
}

export default Stepper
