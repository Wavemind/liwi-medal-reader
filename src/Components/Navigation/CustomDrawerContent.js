/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, CustomDrawerItem } from '@/Components'
import { navigateNestedAndSimpleReset } from '@/Navigators/Root'
import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'

const CustomDrawerContent = props => {
  // Props deconstruction
  const { navigation } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Theme and style elements deconstruction
  const {
    Components: { customDrawerContent },
    Layout,
    Fonts,
  } = useTheme()

  /**
   * Clear clinician and redirect user to clinician list
   */
  const handleLogout = async () => {
    await dispatch(ChangeClinician.action({ clinician: {} }))
    navigateNestedAndSimpleReset('Auth', 'ClinicianSelection')
  }

  return (
    <View style={[Layout.fill]}>
      <DrawerContentScrollView>
        <View style={[customDrawerContent.closeWrapper]}>
          <TouchableOpacity onPress={() => navigation.closeDrawer()}>
            <Icon name={'close'} />
          </TouchableOpacity>
        </View>
        <CustomDrawerItem
          label={t('navigation.home')}
          routeName={'Home'}
          iconName={'home'}
          {...props}
        />
        <CustomDrawerItem
          label={t('navigation.scan_qr_code')}
          routeName={'Scan'}
          iconName={'qr-scan'}
          {...props}
        />
        <CustomDrawerItem
          label={t('navigation.consultations')}
          routeName={'StageWrapper'}
          routeParams={{ stageIndex: 0 }}
          iconName={'consult'}
          {...props}
        />
        <CustomDrawerItem
          label={t('navigation.patient_list')}
          routeName={'PatientList'}
          iconName={'patient-list'}
          {...props}
        />
        <CustomDrawerItem
          label={t('navigation.consent_files')}
          routeName={'TODO'}
          iconName={'consent-file'}
          {...props}
        />
        <CustomDrawerItem
          label={t('navigation.current_consultation')}
          routeName={'TODO'}
          iconName={'summary'}
          {...props}
        />
      </DrawerContentScrollView>

      <View>
        <View style={[customDrawerContent.separator]} />
        <CustomDrawerItem
          label={t('navigation.settings')}
          routeName={'Settings'}
          iconName={'settings'}
          {...props}
        />
        <View style={[customDrawerContent.separator]} />
        <CustomDrawerItem
          label={t('navigation.about')}
          routeName={'InfoModal'}
          routeParams={{ type: 'study' }}
          iconName={'about'}
          {...props}
        />
        <View style={[customDrawerContent.separator]} />
        <CustomDrawerItem
          label={t('navigation.synchronize')}
          routeName={'TODO'}
          iconName={'synchronize'}
          {...props}
        />
        <View style={[customDrawerContent.separator]} />

        <DrawerItem
          label={() => (
            <Text style={[Fonts.textUppercase]}>{t('navigation.logout')}</Text>
          )}
          icon={() => <Icon name={'logout'} />}
          onPress={() => handleLogout()}
        />
      </View>
    </View>
  )
}

export default CustomDrawerContent
