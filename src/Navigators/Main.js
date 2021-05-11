/**
 * The external imports
 */
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { IndexExampleContainer, IndexSettingsContainer } from '@/Containers'

const Drawer = createDrawerNavigator()

const MainNavigator = () => {
  const { t } = useTranslation()

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={IndexExampleContainer}
        options={{
          title: t('navigation.home'),
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={IndexSettingsContainer}
        options={{
          title: t('navigation.settings'),
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  )
}

export default MainNavigator
