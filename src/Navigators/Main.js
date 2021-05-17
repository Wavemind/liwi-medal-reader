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
import { Header } from '@/Components'

const Drawer = createDrawerNavigator()

const MainNavigator = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        header: ({ scene }) => {
          return <Header {...scene} />
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={IndexExampleContainer}
        options={{
          title: t('navigation.home'),
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
