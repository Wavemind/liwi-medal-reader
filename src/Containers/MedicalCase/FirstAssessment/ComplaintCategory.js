/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import differenceInDays from 'date-fns/differenceInDays'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'

const ComplaintCategoryMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const [questions, setQuestions] = useState([])

  // Get CC order (older and neot) and general cc id for neonat and general
  const birthDate = useSelector(state => state.patient.item.birth_date)
  const createdAt = useSelector(state => state.medicalCase.item.createdAt)
  const olderCC = useSelector(
    state =>
      state.algorithm.item.config.full_order.complaint_categories_step.older,
  )
  const neonatCC = useSelector(
    state =>
      state.algorithm.item.config.full_order.complaint_categories_step.neonat,
  )
  const olderGeneralId = useSelector(
    state => state.algorithm.item.config.basic_questions.general_cc_id,
  )
  const neonatGeneralId = useSelector(
    state => state.algorithm.item.config.basic_questions.yi_general_cc_id,
  )

  // Remove general CC
  useEffect(() => {
    const days = differenceInDays(new Date(createdAt), new Date(birthDate))

    if (days <= 60) {
      setQuestions(neonatCC.filter(item => item !== neonatGeneralId))
    } else {
      setQuestions(olderCC.filter(item => item !== olderGeneralId))
    }
  }, [birthDate])

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <Question questionId={item} />}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      keyExtractor={item => item}
    />
  )
}

export default ComplaintCategoryMedicalCaseContainer
