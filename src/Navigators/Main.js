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
import { Header, CustomDrawerContent, BottomNavbar } from '@/Components'
import {
  IndexHomeContainer,
  IndexSettingsContainer,
  ListPatientContainer,
  ListConsentContainer,
  StageWrapperContainer,
  ListMedicalCaseContainer,
  IndexSynchronizationContainer,
  ProfileWrapperPatientContainer,
} from '@/Containers'
import { useTheme } from '@/Theme'

const Drawer = createDrawerNavigator()
const MainNavigator = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const { Layout } = useTheme()

  const clinician = useSelector(state => state.healthFacility.clinician)

  return (
    <>
      <Drawer.Navigator
        initialRouteName="StageWrapper"
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerStyle={Layout.fullWidth}
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
          name="Consultations"
          component={ListMedicalCaseContainer}
          options={{
            title: t('navigation.consultations'),
          }}
        />
        <Drawer.Screen
          name="Synchronization"
          component={IndexSynchronizationContainer}
          options={{
            title: t('navigation.synchronization'),
          }}
        />
        <Drawer.Screen
          name="StageWrapper"
          component={StageWrapperContainer}
          options={{
            title: t('navigation.consultations'),
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
          name="PatientProfile"
          component={ProfileWrapperPatientContainer}
          options={({ route }) => ({ title: route.params?.title })}
        />
        <Drawer.Screen
          name="ConsentList"
          component={ListConsentContainer}
          options={{
            title: t('navigation.consent_list'),
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
      <BottomNavbar />
    </>
  )
}

export default MainNavigator
