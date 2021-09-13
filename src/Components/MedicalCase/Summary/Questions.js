/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import {
  SummaryQuestionItem,
  SectionHeader,
  System,
  Loader,
} from '@/Components'
import { useTheme } from '@/Theme'
import {
  BasicMeasurementQuestionsService,
  AssessmentQuestionsService,
} from '@/Services/Steps'
import MedicalHistory from '@/Store/QuestionsPerSystem/MedicalHistory'
import PhysicalExam from '@/Store/QuestionsPerSystem/PhysicalExam'

const SummaryQuestions = ({ zScoreReferenceTableQuestions }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { Fonts } = useTheme()

  const [loading, setLoading] = useState(true)

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  useEffect(async () => {
    await dispatch(PhysicalExam.action())
    await dispatch(MedicalHistory.action())
    setLoading(false)
  }, [])

  const medicalHistoryStep = useSelector(
    state => state.algorithm.item.config.full_order.medical_history_step,
  )
  const physicalExamStep = useSelector(
    state => state.algorithm.item.config.full_order.physical_exam_step,
  )
  const basicMeasurements = BasicMeasurementQuestionsService()
  const assessments = AssessmentQuestionsService()

  const assessmentsResult = assessments.filter(
    nodeId =>
      !(mcNodes[nodeId].answer === null && mcNodes[nodeId].value === ''),
  )

  const basicMeasurementResult = basicMeasurements.filter(
    nodeId =>
      !(mcNodes[nodeId].answer === null && mcNodes[nodeId].value === '') &&
      !zScoreReferenceTableQuestions.includes(nodeId),
  )

  if (loading) {
    return <Loader />
  }

  return (
    <View>
      <SectionHeader
        label={t('containers.medical_case.steps.basic_measurements')}
      />
      {basicMeasurementResult.length > 0 ? (
        basicMeasurementResult.map(nodeId => (
          <SummaryQuestionItem key={nodeId} nodeId={nodeId} />
        ))
      ) : (
        <Text style={[Fonts.textCenter, Fonts.textSmall]}>
          {t('components.summary.no_questions')}
        </Text>
      )}
      <SectionHeader
        label={t('containers.medical_case.steps.medical_history')}
      />
      {medicalHistoryStep.map(system => (
        <System
          key={`medical-history-${system.title}`}
          systemName={system.title}
          step="medicalHistory"
          readOnly
        />
      ))}
      <SectionHeader
        label={t('containers.medical_case.steps.physical_exams')}
      />
      {physicalExamStep.map(system => (
        <System
          key={`physical-exam-${system.title}`}
          systemName={system.title}
          step="physicalExam"
          readOnly
        />
      ))}
      <SectionHeader label={t('containers.medical_case.steps.assessments')} />
      {assessmentsResult.length > 0 ? (
        assessmentsResult.map(nodeId => (
          <SummaryQuestionItem key={nodeId} nodeId={nodeId} />
        ))
      ) : (
        <Text style={[Fonts.textCenter, Fonts.textSmall]}>
          {t('components.summary.no_questions')}
        </Text>
      )}
    </View>
  )
}

export default SummaryQuestions
