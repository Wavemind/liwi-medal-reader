/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useSelector, useDispatch } from 'react-redux'
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
  StageWrapperMedicalCaseContainer,
  ListMedicalCaseContainer,
  IndexSynchronizationContainer,
  ProfileWrapperPatientContainer,
  SummaryWrapperMedicalCaseContainer,
} from '@/Containers'
import DestroyMedicalCase from '@/Store/MedicalCase/Destroy'
import DestroyPatient from '@/Store/Patient/Destroy'
import { useTheme } from '@/Theme'

const Drawer = createDrawerNavigator()
const MainNavigator = ({ route }) => {
  // Theme and style elements deconstruction
  const { Layout } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const clinician = useSelector(state => state.healthFacility.clinician)
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const closedAt = useSelector(state => state.medicalCase.item.closedAt)

  // Destroy medical case in store after closing a medical case
  useEffect(() => {
    dispatch(DestroyMedicalCase.action())
    dispatch(DestroyPatient.action())
  }, [route.state?.routes[0].params?.destroyCurrentConsultation])

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerStyle={
          medicalCaseId && closedAt === 0 ? Layout.fullWidth : Layout.halfWidth
        }
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
          component={StageWrapperMedicalCaseContainer}
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
          name="MedicalCaseSummary"
          component={SummaryWrapperMedicalCaseContainer}
          options={{
            title: t('navigation.summary'),
          }}
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
