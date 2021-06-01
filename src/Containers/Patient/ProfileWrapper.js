/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { PatientTabBar } from '@/Components'
import {
  PersonalInfoPatientContainer,
  ConsultationsPatientContainer,
} from '@/Containers'

const ProfileWrapperPatientContainer = props => {
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()

  const { Layout } = useTheme()

  return (
    <View style={Layout.fill}>
      <Tab.Navigator
        tabBarOptions={{ scrollEnabled: true }}
        tabBar={tabProps => <PatientTabBar {...tabProps} />}
      >
        <Tab.Screen
          name="Consultations"
          component={ConsultationsPatientContainer}
          options={{
            title: t('navigation.consultations'),
          }}
        />
        <Tab.Screen
          name="PersonalInfo"
          component={PersonalInfoPatientContainer}
          options={{
            title: t('navigation.personal_info'),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default ProfileWrapperPatientContainer
