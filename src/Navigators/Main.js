/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFocusEffect } from '@react-navigation/native'
import { BackHandler } from 'react-native'

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
import ResetValidation from '@/Store/Validation/Reset'
import SetParams from '@/Store/Modal/SetParams'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'
import { useTheme } from '@/Theme'
import { ReadableDate } from '@/Utils'
import { formatDate } from '@/Utils/Date'

const Drawer = createDrawerNavigator()
const MainNavigator = ({ route, navigation }) => {
  // Theme and style elements deconstruction
  const { Layout } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const clinician = useSelector(state => state.healthFacility.clinician)
  const patient = useSelector(state => state.patient.item)
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const medicalCaseClosedAt = useSelector(
    state => state.medicalCase.item.closedAt,
  )
  const medicalCaseCreatedAt = useSelector(
    state => state.medicalCase.item.createdAt,
  )

  // Destroy medical case in store after closing a medical case
  useEffect(() => {
    if (route.state?.routes[0].params?.destroyCurrentConsultation) {
      dispatch(DestroyMedicalCase.action())
      dispatch(DestroyPatient.action())
      dispatch(ResetValidation.action())
      delete route.state?.routes[0].params?.destroyCurrentConsultation
    }
  }, [route.state?.routes[0].params?.destroyCurrentConsultation, medicalCaseId])

  // Adds an event listener to tablet back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        // Opens the existMedicalCase modal and redirects to the Home screen
        if (medicalCaseId && medicalCaseClosedAt === 0) {
          await dispatch(
            SetParams.action({
              type: 'exitMedicalCase',
              params: { routeName: 'Home', routeParams: {} },
            }),
          )
          await dispatch(ToggleVisibility.action({}))
        } else if (
          navigation.dangerouslyGetState()?.routes[0]?.state?.index &&
          !navigation.dangerouslyGetState()?.routes[0]?.state?.index !==
            route.key
        ) {
          navigation.goBack()
        } else {
          await dispatch(
            SetParams.action({
              type: 'exitApp',
            }),
          )
          await dispatch(ToggleVisibility.action({}))
        }
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [medicalCaseId]),
  )

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerStyle={Layout.fullWidth}
        screenOptions={{
          headerShown: true,
          header: ({ scene }) => <Header {...scene} />,
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
            title: `${patient.first_name} ${patient.last_name} - ${
              patient.birth_date && formatDate(patient.birth_date)
            } (${
              patient.birth_date && medicalCaseCreatedAt
                ? ReadableDate(medicalCaseCreatedAt, patient.birth_date)
                : ''
            })`,
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
            title: t('navigation.medical_case', {
              first_name: patient.first_name,
              last_name: patient.last_name,
              birth_date: patient.birth_date
                ? formatDate(patient.birth_date)
                : '',
              readable_date:
                patient.birth_date && medicalCaseCreatedAt
                  ? ReadableDate(medicalCaseCreatedAt, patient.birth_date)
                  : '',
            }),
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
