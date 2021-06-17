/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import capitalize from 'lodash/capitalize'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import Item from './Item'
import { getStages } from '@/Utils/Navigation/GetStages'

const DrawerItem = () => {
  const { t } = useTranslation()
  const stageIndex = useSelector(
    state => state.medicalCase.item.advancement.stage,
  )
  const { first_name, last_name, birth_date } = useSelector(
    state => state.patient.item,
  )
  const createdAt = useSelector(state => state.medicalCase.item.createdAt)

  const [stages] = useState(getStages())

  const {
    Components: { medicalCaseDrawer },
    Layout,
  } = useTheme()

  /**
   * Returns the string displaying the age of the patient
   * @returns {string}
   */
  const age = () => {
    return birth_date ? formatDistanceStrict(createdAt, birth_date) : ''
  }

  return (
    <View style={medicalCaseDrawer.wrapper}>
      <View style={medicalCaseDrawer.header}>
        <Text style={medicalCaseDrawer.textHeader}>
          {t('components.medical_case_drawer.current_medical_case')}
        </Text>
        <View style={Layout.rowCenter}>
          <Text style={medicalCaseDrawer.textPatient}>
            {`${capitalize(first_name)} ${capitalize(last_name)}`}
          </Text>
          <Text style={medicalCaseDrawer.textMonth}>{age()}</Text>
        </View>
      </View>
      <ScrollView>
        {stages.map((stage, index) => (
          <Item
            key={index}
            stage={stage}
            index={index}
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
