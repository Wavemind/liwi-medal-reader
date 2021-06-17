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
import { navigateAndSimpleReset } from '@/Navigators/Root'

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
          size={FontSize.big}
          color={focused ? Colors.secondary : Colors.primary}
        />
      )}
      // TODO Check if we still need to reset the stack when the db shit works
      onPress={() => navigateAndSimpleReset(routeName, routeParams)}
    />
  )
}

export default CustomDrawerItem
