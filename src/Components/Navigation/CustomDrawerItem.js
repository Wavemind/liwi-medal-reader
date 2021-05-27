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

const CustomDrawerItem = ({
  label,
  routeName,
  routeParams = {},
  iconName,
  navigation,
}) => {
  const { index, routes } = navigation.dangerouslyGetState()

  // Theme and style elements deconstruction
  const {
    Components: { customDrawerItem },
    Colors,
    FontSize,
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
      style={customDrawerItem.wrapper}
      activeBackgroundColor={Colors.primary}
      focused={routes[index].name === routeName}
      icon={({ focused }) => (
        <Icon
          name={iconName}
          size={FontSize.drawerIcon}
          color={focused ? Colors.secondary : Colors.primary}
        />
      )}
      onPress={() => navigation.navigate(routeName, routeParams)}
    />
  )
}

export default CustomDrawerItem
