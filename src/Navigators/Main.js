/**
 * The external imports
 */
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { IndexHomeContainer, IndexSettingsContainer } from '@/Containers'
import { Header } from '@/Components'

const Drawer = createDrawerNavigator()

const MainNavigator = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const clinician = useSelector(state => state.healthFacility.clinician)

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
        component={IndexHomeContainer}
        options={{
          title: t('navigation.home', {
            clinician: `${clinician.first_name} ${clinician.last_name}`,
          }),
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
