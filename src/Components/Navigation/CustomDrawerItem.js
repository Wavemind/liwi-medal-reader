/**
 * The external imports
 */
import React from 'react'
import { Text } from 'react-native'
import { DrawerItem } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import SetParams from '@/Store/Modal/SetParams'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'
import { navigateAndSimpleReset } from '@/Navigators/Root'

const CustomDrawerItem = ({
  label,
  routeName,
  routeParams = {},
  iconName,
  navigation,
}) => {
  const dispatch = useDispatch()

  const { index, routes } = navigation.dangerouslyGetState()

  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const closedAt = useSelector(state => state.medicalCase.item.closedAt)

  // Theme and style elements deconstruction
  const {
    Components: { customDrawerItem },
    Colors,
    FontSize,
  } = useTheme()

  const handleNavigation = async () => {
    if (medicalCaseId && closedAt === 0) {
      await dispatch(
        SetParams.action({
          type: 'exitMedicalCase',
          params: { routeName, routeParams },
        }),
      )
      await dispatch(ToggleVisibility.action({}))
    } else {
      navigateAndSimpleReset(routeName, routeParams)
    }
  }

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
      onPress={handleNavigation}
    />
  )
}

export default CustomDrawerItem
