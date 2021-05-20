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
import {
  IndexHomeContainer,
  IndexSettingsContainer,
  ListPatientContainer,
  ListMedicalCaseContainer,
} from '@/Containers'
import { Header, CustomDrawerContent } from '@/Components'

const Drawer = createDrawerNavigator()
const MainNavigator = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const clinician = useSelector(state => state.healthFacility.clinician)

  return (
    <Drawer.Navigator
      initialRouteName="Home"
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
        name="PatientList"
        component={ListPatientContainer}
        options={{
          title: t('navigation.patient_list'),
        }}
      />
      <Drawer.Screen
        name="Consultations"
        component={ListMedicalCaseContainer}
        options={{
          title: t('navigation.consultations'),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={IndexSettingsContainer}
        options={{
          title: t('navigation.settings'),
        }}
      />
    </Drawer.Navigator>
  )
}

export default MainNavigator
