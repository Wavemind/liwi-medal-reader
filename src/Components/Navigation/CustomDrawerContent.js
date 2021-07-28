/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, CustomDrawerItem, MedicalCaseDrawer } from '@/Components'
import { navigateNestedAndSimpleReset } from '@/Navigators/Root'
import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'
import SetParams from '@/Store/Modal/SetParams'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

const CustomDrawerContent = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Components: { customDrawerContent },
    Layout,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const consentManagement = useSelector(
    state => state.algorithm.item.config.consent_management,
  )
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const closedAt = useSelector(state => state.medicalCase.item.closedAt)
  const stageIndex = useSelector(state => state.medicalCase.item.stage)
  const stepIndex = useSelector(state => state.medicalCase.item.step)

  /**
   * Clear clinician and redirect user to clinician list
   */
  const handleLogout = async () => {
    if (medicalCaseId && closedAt === 0) {
      await dispatch(
        SetParams.action({
          type: 'exitMedicalCase',
          params: {
            routeName: 'Auth',
            routeParams: { screen: 'ClinicianSelection' },
          },
        }),
      )
      await dispatch(ToggleVisibility.action({}))
    } else {
      await dispatch(ChangeClinician.action({ clinician: {} }))
      navigateNestedAndSimpleReset('Auth', 'ClinicianSelection')
    }
  }

  return (
    <View style={customDrawerContent.container}>
      <View style={customDrawerContent.wrapper}>
        <DrawerContentScrollView contentContainerStyle={Layout.fill}>
          <View style={customDrawerContent.closeWrapper}>
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
              <Icon name="close" />
            </TouchableOpacity>
          </View>
          <CustomDrawerItem
            label={t('navigation.home')}
            routeName="Home"
            iconName="home"
            navigation={navigation}
          />
          <CustomDrawerItem
            label={t('navigation.scan_qr_code')}
            routeName="Scan"
            iconName="qr-scan"
            navigation={navigation}
          />
          <CustomDrawerItem
            label={t('navigation.consultations')}
            routeName="Consultations"
            iconName="consultation"
            navigation={navigation}
          />
          <CustomDrawerItem
            label={t('navigation.patient_list')}
            routeName="PatientList"
            iconName="patient-list"
            navigation={navigation}
          />
          {consentManagement && (
            <CustomDrawerItem
              label={t('navigation.consent_list')}
              routeName="ConsentList"
              iconName="consent-file"
              navigation={navigation}
            />
          )}
          {medicalCaseId && closedAt === 0 && (
            <CustomDrawerItem
              label={t('navigation.current_consultation')}
              routeName="StageWrapper"
              routeParams={{ stageIndex, stepIndex }}
              iconName="summary"
              navigation={navigation}
              disabled
            />
          )}
        </DrawerContentScrollView>

        <View>
          <View style={customDrawerContent.separator} />
          <CustomDrawerItem
            label={t('navigation.settings')}
            routeName="Settings"
            iconName="settings"
            navigation={navigation}
          />
          <View style={customDrawerContent.separator} />
          <CustomDrawerItem
            label={t('navigation.about')}
            routeName="Study"
            iconName="about"
            navigation={navigation}
          />
          <View style={customDrawerContent.separator} />
          <CustomDrawerItem
            label={t('navigation.synchronize')}
            routeName="Synchronization"
            iconName="synchronize"
            navigation={navigation}
          />
          <View style={customDrawerContent.separator} />

          <DrawerItem
            label={() => (
              <Text style={customDrawerContent.logout}>
                {t('navigation.logout')}
              </Text>
            )}
            icon={() => <Icon name="logout" />}
            onPress={() => handleLogout()}
          />
        </View>
      </View>
      {medicalCaseId && closedAt === 0 && <MedicalCaseDrawer />}
    </View>
  )
}

export default CustomDrawerContent
