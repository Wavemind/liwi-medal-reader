/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Config } from '@/Config'
import Item from './Item'

const DrawerItem = () => {
  const { t } = useTranslation()
  const stageIndex = useSelector(
    state => state.medicalCase.item.advancement.stage,
  )

  const {
    Components: { medicalCaseDrawer },
    Layout,
  } = useTheme()

  return (
    <View style={medicalCaseDrawer.wrapper}>
      <View style={medicalCaseDrawer.header}>
        <Text style={medicalCaseDrawer.textHeader}>
          {t('components.medical_case_drawer.current_medical_case')}
        </Text>
        <View style={Layout.rowCenter}>
          <Text style={medicalCaseDrawer.textPatient}>Alain TODO</Text>
          <Text style={medicalCaseDrawer.textMonth}>X mois</Text>
        </View>
      </View>
      <ScrollView>
        {Config.NAVIGATION.INTERVENTION_STAGES.map((stage, index) => (
          <Item
            stage={stage}
            index={index}
            // TODO Set real medical case status
            status={
              index === stageIndex
                ? 'current'
                : index > stageIndex
                ? 'notDone'
                : 'done'
            }
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default DrawerItem
