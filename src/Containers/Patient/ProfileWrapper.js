/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { PatientTabBar } from '@/Components'
import {
  PersonalInfoPatientContainer,
  ConsultationsPatientContainer,
} from '@/Containers'

const ProfileWrapperPatientContainer = () => {
  const {
    Layout,
    Containers: { global },
  } = useTheme()
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <Tab.Navigator
        options={{ scrollEnabled: true }}
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
    </Animated.View>
  )
}

export default ProfileWrapperPatientContainer
