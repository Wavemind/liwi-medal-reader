/**
 * The external imports
 */
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { IndexExampleContainer, IndexSettingsContainer } from '@/Containers'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const MainNavigator = () => {
  const { t } = useTranslation()

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#e91e63',
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home">
        {() => (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={IndexExampleContainer}
              options={{ title: t('navigation.home') }}
            />
            <Stack.Screen
              name="Settings"
              component={IndexSettingsContainer}
              options={{ title: t('navigation.settings') }}
            />
          </Stack.Navigator>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Settings"
        component={IndexSettingsContainer}
        options={{ title: t('navigation.settings') }}
      />
    </Drawer.Navigator>
  )
}

export default MainNavigator
