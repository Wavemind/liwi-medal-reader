/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

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
import { formatDate } from '@/Utils/Date'
import { BasicMeasurementQuestionsService } from '@/Services/Steps'

const SummaryWrapperMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()
  const {
    Layout,
    Gutters,
    Containers: { summaryWrapper },
  } = useTheme()

  const patient = useSelector(state => state.patient.item)
  const medicalCase = useSelector(state => state.medicalCase.item)
  const nodes = useSelector(state => state.algorithm.item.nodes)

  // Get z-score questions
  const basicMeasurements = BasicMeasurementQuestionsService()
  const zScoreReferenceTableQuestions = basicMeasurements.filter(
    nodeId => nodes[nodeId].reference_table_x_id,
  )
  ///////////////////////////////////////////////////////

  // Get kind of consultation
  const kindOfConsultationId = useSelector(
    state =>
      state.algorithm.item.config.optional_basic_questions
        .kind_of_consultation_id,
  )
  let kindOfConsultation = null

  if (kindOfConsultationId) {
    const kindOfConsultationAnswerId = patient.patientValues.find(
      patientValue => parseInt(patientValue.node_id) === kindOfConsultationId,
    ).answer_id

    kindOfConsultation =
      nodes[kindOfConsultationId].answers[kindOfConsultationAnswerId]
  }
  ///////////////////////////////////////////////////////

  // Get gender
  const genderNodeId = useSelector(
    state => state.algorithm.item.config.basic_questions.gender_question_id,
  )

  const genderAnswerId = patient.patientValues.find(
    patientValue => parseInt(patientValue.node_id) === genderNodeId,
  ).answer_id

  const gender = nodes[genderNodeId].answers[genderAnswerId]
  ///////////////////////////////////////////////////////

  return (
    <View style={Layout.fill}>
      <View style={summaryWrapper.patientValues}>
        <View style={summaryWrapper.leftColumn}>
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
            value={formatDate(patient.birth_date)}
          />
        </View>
        <View style={summaryWrapper.rightColumn}>
          {zScoreReferenceTableQuestions.map(nodeId => (
            <SummaryMetadata
              label={translate(nodes[nodeId].label)}
              value={medicalCase.nodes[nodeId].value}
            />
          ))}
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
                value={formatDate(medicalCase.createdAt)}
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

              <SummaryQuestions
                zScoreReferenceTableQuestions={zScoreReferenceTableQuestions}
              />
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
