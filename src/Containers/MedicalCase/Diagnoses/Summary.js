/**
 * The external imports
 */
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

/**
 * The internal imports
 */
import {
  DiagnosisDrugs,
  CustomDrugs,
  DrugBooleanButton,
  AdditionalSelect,
} from '@/Components'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const Summary = () => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Gutters,
    Containers: { finalDiagnoses, drugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const agreed = useSelector(state => state.medicalCase.item.diagnosis.agreed)
  const additional = useSelector(state => state.medicalCase.item.diagnosis.additional)
  const custom = useSelector(state => state.medicalCase.item.diagnosis.custom)

  return (
    <ScrollView>
      <View style={Gutters.regularBMargin}>
        {Object.values(agreed).map(diagnosis => (
          <View key={`diagnosis-${diagnosis.id}`} style={drugs.wrapper}>
            <View style={drugs.diagnosisHeaderWrapper}>
              <Text style={drugs.diagnosisHeader}>
                {translate(algorithm.nodes[diagnosis.id].label)}
              </Text>
              <Text style={drugs.diagnosisKey}>
                {t('containers.medical_case.drugs.proposed')}
              </Text>
            </View>
            <View style={Gutters.regularHPadding}>
              <Text style={drugs.drugsHeader}>
                {t('containers.medical_case.drugs.drugs')}
              </Text>
              <Text style={drugs.drugsHeader}>Management & Counselling</Text>
            </View>
          </View>
        ))}
        {Object.values(additional).map(diagnosis => (
          <View key={`diagnosis-${diagnosis.id}`} style={drugs.wrapper}>
            <View style={drugs.diagnosisHeaderWrapper}>
              <Text style={drugs.diagnosisHeader}>
                {translate(algorithm.nodes[diagnosis.id].label)}
              </Text>
              <Text style={drugs.diagnosisKey}>
                {t('containers.medical_case.drugs.additional')}
              </Text>
            </View>
            <View style={Gutters.regularHPadding}>
              <Text style={drugs.drugsHeader}>
                {t('containers.medical_case.drugs.drugs')}
              </Text>
              <Text style={drugs.drugsHeader}>Management & Counselling</Text>
            </View>
          </View>
        ))}
        {Object.values(custom).map(diagnosis => (
          <View key={`diagnosis-${diagnosis.id}`} style={drugs.wrapper}>
            <View style={drugs.diagnosisHeaderWrapper}>
              <Text style={drugs.diagnosisHeader}>
                {diagnosis.name}
              </Text>
              <Text style={drugs.diagnosisKey}>
                {t('containers.medical_case.drugs.custom')}
              </Text>
            </View>
            <View style={Gutters.regularHPadding}>
              <Text style={drugs.drugsHeader}>
                {t('containers.medical_case.drugs.drugs')}
              </Text>
              <Text style={drugs.drugsHeader}>Management & Counselling</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default Summary
