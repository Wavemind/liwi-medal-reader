/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, CustomDrawerItem } from '@/Components'
import { navigateNestedAndSimpleReset } from '@/Navigators/Root'
import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'
import MedicalCaseDrawer from './MedicalCase/Drawer/Drawer'

const CustomDrawerContent = props => {
  // Props deconstruction
  const { navigation } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [medicalCaseExists, setMedicalCaseExists] = useState(false)

  // Theme and style elements deconstruction
  const {
    Components: { customDrawerContent },
    Layout,
  } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)
  const medicalCase = useSelector(state => state.medicalCase.item)
  console.log(medicalCase)

  useEffect(() => {
    setMedicalCaseExists('id' in medicalCase)
  }, [medicalCase])

  /**
   * Clear clinician and redirect user to clinician list
   */
  const handleLogout = async () => {
    await dispatch(ChangeClinician.action({ clinician: {} }))
    navigateNestedAndSimpleReset('Auth', 'ClinicianSelection')
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
            {...props}
          />
          <CustomDrawerItem
            label={t('navigation.scan_qr_code')}
            routeName="Scan"
            iconName="qr-scan"
            {...props}
          />
          <CustomDrawerItem
            label={t('navigation.consultations')}
            routeName="Consultations"
            iconName="consultation"
            {...props}
          />
          <CustomDrawerItem
            label={t('navigation.patient_list')}
            routeName="PatientList"
            iconName="patient-list"
            {...props}
          />
          {algorithm.config.consent_management && (
            <CustomDrawerItem
              label={t('navigation.consent_list')}
              routeName="ConsentList"
              iconName="consent-file"
              {...props}
            />
          )}
          {medicalCaseExists && (
            <CustomDrawerItem
              label={t('navigation.current_consultation')}
              routeName="StageWrapper"
              routeParams={{ stageIndex: 0 }}
              iconName="summary"
              {...props}
            />
          )}
        </DrawerContentScrollView>

        <View>
          <View style={customDrawerContent.separator} />
          <CustomDrawerItem
            label={t('navigation.settings')}
            routeName="Settings"
            iconName="settings"
            {...props}
          />
          <View style={customDrawerContent.separator} />
          <CustomDrawerItem
            label={t('navigation.about')}
            routeName="InfoModal"
            routeParams={{ type: 'study' }}
            iconName="about"
            {...props}
          />
          <View style={customDrawerContent.separator} />
          <CustomDrawerItem
            label={t('navigation.synchronize')}
            routeName="Synchronization"
            iconName="synchronize"
            {...props}
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
      {medicalCaseExists && <MedicalCaseDrawer />}
    </View>
  )
}

export default CustomDrawerContent
