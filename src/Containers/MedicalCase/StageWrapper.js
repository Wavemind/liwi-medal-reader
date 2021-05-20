import React from 'react'
import { Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/Theme'
import { TabItem, SideBar } from '@/Components'
import { Config } from '@/Config'

const IndexConsultationContainer = props => {
  const { t } = useTranslation()
  const {
    Containers: { medicalCase },
  } = useTheme()
  const { route } = props

  let stage

  if (route.params?.stageIndex !== undefined) {
    stage = Config.NAVIGATION.INTERVENTION_STAGES[route.params?.stageIndex]
  } else {
    stage = stage = Config.NAVIGATION.INTERVENTION_STAGES[1]
  }
  const Tab = createMaterialTopTabNavigator()

  return (
    <View style={medicalCase.wrapper}>
      <SideBar />
      <View style={medicalCase.medicalCaseWrapper}>
        <View style={medicalCase.title}>
          <Text style={medicalCase.titleText}>{stage.label}</Text>
        </View>
        <Tab.Navigator
          tabBarOptions={{ scrollEnabled: true, tabStyle: medicalCase.tabBar }}
          tabBar={tabProps => <TabItem {...tabProps} />}
        >
          {stage.steps.map(step => (
            <Tab.Screen
              name={t(`medical_case.steps.${step.label}`)}
              component={step.component}
            />
          ))}
        </Tab.Navigator>
      </View>
    </View>
  )
}

export default IndexConsultationContainer
