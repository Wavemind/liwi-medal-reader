/**
 * The external imports
 */
import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'

const BasicMeasurementMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const questions = useSelector(
    state => state.algorithm.item.config.full_order.basic_measurements_step,
  )

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

export default BasicMeasurementMedicalCaseContainer
