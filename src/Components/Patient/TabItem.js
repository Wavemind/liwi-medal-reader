/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const TabItem = ({ active, currentDescriptors, routeName }) => {
  const {
    Components: { patientTabItem },
  } = useTheme()

  const {
    navigation,
    options: { title },
  } = currentDescriptors

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(routeName)
      }}
      style={patientTabItem.tab(active)}
    >
      <Text style={patientTabItem.tabText(active)}>{title}</Text>
    </TouchableOpacity>
  )
}

export default TabItem
