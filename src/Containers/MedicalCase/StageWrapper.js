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
import { getStages } from '@/Utils/Navigation/GetStages'

const StageWrapperMedicalCaseContainer = ({ route }) => {
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()

  const {
    Containers: { medicalCase },
  } = useTheme()
  const stageIndex = route.params?.stageIndex || 0
  const stepIndex = route.params?.stepIndex || 0

  const stages = getStages()
  const stage = stages[stageIndex]
  const currentStep = stage.steps[stepIndex]

  return (
    <View style={medicalCase.wrapper}>
      <SideBar stageIndex={stageIndex} />
      <View style={medicalCase.medicalCaseWrapper}>
        <View style={medicalCase.titleWrapper}>
          <Text style={medicalCase.title}>
            {t(`containers.medical_case.stages.${stage.label}`)}
          </Text>
        </View>
        <Tab.Navigator
          initialRouteName={currentStep.label}
          screenOptions={{
            swipeEnabled: false,
          }}
          options={{
            lazy: true,
            scrollEnabled: true,
            tabStyle: medicalCase.tabBar,
          }}
          tabBar={tabProps => (
            <TabBar {...{ ...tabProps, stageIndex, stepIndex }} />
          )}
        >
          {stage.steps.map(step => (
            <Tab.Screen
              key={step.label}
              name={step.label}
              component={step.component}
            />
          ))}
        </Tab.Navigator>
      </View>
    </View>
  )
}

export default StageWrapperMedicalCaseContainer
