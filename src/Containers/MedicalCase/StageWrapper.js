/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { TabBar, SideBar } from '@/Components'
import { Config } from '@/Config'

const IndexConsultationContainer = props => {
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()
  const { route } = props

  const {
    Containers: { medicalCase },
  } = useTheme()

  let stage

  if (route.params?.stageIndex !== undefined) {
    stage = Config.NAVIGATION.INTERVENTION_STAGES[route.params?.stageIndex]
  } else {
    stage = stage = Config.NAVIGATION.INTERVENTION_STAGES[0]
  }
  return (
    <View style={medicalCase.wrapper}>
      <SideBar />
      <View style={medicalCase.medicalCaseWrapper}>
        <View style={medicalCase.title}>
          <Text style={medicalCase.titleText}>
            {t(`containers.medical_case.stages.${stage.label}`)}
          </Text>
        </View>
        <Tab.Navigator
          tabBarOptions={{ scrollEnabled: true, tabStyle: medicalCase.tabBar }}
          tabBar={tabProps => <TabBar {...tabProps} />}
        >
          {stage.steps.map(step => (
            <Tab.Screen name={step.label} component={step.component} />
          ))}
        </Tab.Navigator>
      </View>
    </View>
  )
}

export default IndexConsultationContainer
