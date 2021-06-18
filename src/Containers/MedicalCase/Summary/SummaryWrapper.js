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
import { SummaryFinalDiagnoses, SummaryQuestions } from '@/Components'

const SummaryWrapperMedicalCaseContainer = () => {
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
          name="FinalDiagnoses"
          component={SummaryFinalDiagnoses}
          options={{
            title: t('navigation.final_diagnoses'),
          }}
        />
        <Tab.Screen
          name="Questions"
          component={SummaryQuestions}
          options={{
            title: t('navigation.questions'),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default SummaryWrapperMedicalCaseContainer
