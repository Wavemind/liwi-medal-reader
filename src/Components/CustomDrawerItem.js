/**
 * The external imports
 */
import React from 'react'
import { Text } from 'react-native'

import { DrawerItem } from '@react-navigation/drawer'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const CustomDrawerItem = props => {
  // Props deconstruction
  const { label, routeName, iconName, navigation } = props

  const { index, routes } = navigation.dangerouslyGetState()

  // Theme and style elements deconstruction
  const {
    Components: { customDrawerItem },
  } = useTheme()
  return (
    <DrawerItem
      label={({ focused }) => (
        <Text
          style={
            focused
              ? customDrawerItem.textFocused
              : customDrawerItem.textInactive
          }
        >
          {label}
        </Text>
      )}
      activeBackgroundColor={'#CBCDD1'}
      focused={routes[index].name === routeName}
      icon={() => <Icon name={iconName} />}
      onPress={() => navigation.navigate(routeName)}
    />
  )
}

export default CustomDrawerItem
