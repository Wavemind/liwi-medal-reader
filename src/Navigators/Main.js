/**
 * The external imports
 */
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

/**
 * The internal imports
 */
import { IndexHomeContainer, IndexSettingsContainer } from '@/Containers'
import { Header, CustomDrawerContent, BottomNavbar } from '@/Components'
import StageWrapper from '@/Containers/MedicalCase/StageWrapper'

const Drawer = createDrawerNavigator()
const MainNavigator = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const clinician = useSelector(state => state.healthFacility.clinician)

  return (
    <>
      <Drawer.Navigator
        initialRouteName="StageWrapper"
        drawerContent={props => <CustomDrawerContent {...props} />}
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
            title: t('navigation.welcome', {
              clinician: `${clinician.first_name} ${clinician.last_name}`,
            }),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={IndexSettingsContainer}
          options={{
            title: t('navigation.settings'),
          }}
        />
        <Drawer.Screen
          name="StageWrapper"
          component={StageWrapper}
          options={{
            title: t('navigation.consultations'),
          }}
        />
      </Drawer.Navigator>
      <BottomNavbar />
    </>
  )
}

export default MainNavigator
