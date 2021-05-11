/**
 * The external imports
 */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { IndexExampleContainer, IndexSettingsContainer } from '@/Containers'

const Stack = createStackNavigator()

const MainNavigator = () => {
  const { t } = useTranslation()

  return (
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
  )
}

export default MainNavigator
