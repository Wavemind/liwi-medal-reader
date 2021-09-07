/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import format from 'date-fns/format'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import {
  SummaryFinalDiagnoses,
  SummaryQuestions,
  PatientTabBar,
  SummaryMetadata,
} from '@/Components'
import { translate } from '@/Translations/algorithm'
import { ReadableDate } from '@/Utils'

const SummaryWrapperMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()
  const { Layout, Gutters } = useTheme()

  const patient = useSelector(state => state.patient.item)
  const medicalCase = useSelector(state => state.medicalCase.item)
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const kindOfConsultationId = useSelector(
    state =>
      state.algorithm.item.config.optional_basic_questions
        .kind_of_consultation_id,
  )
  let kindOfConsultation = null

  if (kindOfConsultationId) {
    const kindOfConsultationAnswerId = patient.patientValues.find(
      patientValue => patientValue.node_id === kindOfConsultationId,
    ).answer_id

    kindOfConsultation =
      nodes[kindOfConsultationId].answers[kindOfConsultationAnswerId]
  }

  // Get gender
  const genderNodeId = useSelector(
    state => state.algorithm.item.config.basic_questions.gender_question_id,
  )
  const genderAnswerId = patient.patientValues.find(
    patientValue => patientValue.node_id === genderNodeId,
  ).answer_id
  const gender = nodes[genderNodeId].answers[genderAnswerId]

  return (
    <View style={Layout.fill}>
      <View style={[Layout.row, Gutters.smallHMargin, Gutters.smallVMargin]}>
        <View style={[Layout.fill, Layout.column, Gutters.tinyRMargin]}>
          <SummaryMetadata
            label={t('patient.first_name')}
            value={patient.first_name}
          />
          <SummaryMetadata
            label={t('patient.last_name')}
            value={patient.last_name}
          />
          <SummaryMetadata
            label={t('patient.gender')}
            value={translate(gender.label)}
          />
          <SummaryMetadata
            label={t('patient.birth_date')}
            value={format(patient.birth_date, 'dd.MM.yyyy')}
          />
        </View>
        <View style={[Layout.fill, Layout.column, Gutters.tinyLMargin]}>
          <SummaryMetadata label="key" value="value" />
        </View>
      </View>

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
          component={() => (
            <ScrollView style={[Gutters.smallHMargin, Gutters.smallVMargin]}>
              <SummaryMetadata
                label={t('containers.medical_case.summary.date_consultation')}
                value={format(medicalCase.createdAt, 'dd.MM.yyyy')}
              />
              <SummaryMetadata
                label={t(
                  'containers.medical_case.summary.age_date_consultation',
                )}
                value={ReadableDate(medicalCase.createdAt, patient.birth_date)}
              />
              {kindOfConsultationId && (
                <SummaryMetadata
                  label={t(
                    'containers.medical_case.summary.type_of_consultation',
                  )}
                  value={translate(kindOfConsultation.label)}
                />
              )}

              <SummaryQuestions />
            </ScrollView>
          )}
          options={{
            title: t('navigation.questions'),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default SummaryWrapperMedicalCaseContainer
