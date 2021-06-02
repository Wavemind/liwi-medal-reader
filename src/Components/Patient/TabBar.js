/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { PatientTabItem } from '@/Components'

const TabBar = ({ state, descriptors }) => {
  const { Layout } = useTheme()

  return (
    <View style={Layout.row}>
      {state.routes.map((route, index) => (
        <PatientTabItem
          key={route.key}
          currentDescriptors={descriptors[route.key]}
          routeName={state.routes[index]}
          active={state.index === index}
        />
      ))}
    </View>
  )
}

export default TabBar
