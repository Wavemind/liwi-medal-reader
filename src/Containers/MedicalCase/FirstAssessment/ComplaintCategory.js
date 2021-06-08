/**
 * The external imports
 */
import React from 'react'
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

  const birthDate = useSelector(state => state.patient.item.birth_date)
  const test = useSelector(
    state => state.algorithm.item.config.full_order.complaint_categories_step,
  )
  const days = differenceInDays(new Date(), new Date(birthDate))

  const questions = useSelector(state => {
    if (days <= 60) {
      return state.algorithm.item.config.full_order.complaint_categories_step[1]
        .neonat_children
    }
    return state.algorithm.item.config.full_order.complaint_categories_step[0]
      .older_children
  })

  console.log(questions)
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
