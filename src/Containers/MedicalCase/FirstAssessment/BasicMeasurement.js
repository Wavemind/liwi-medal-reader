/**
 * The external imports
 */
import React from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { BasicMeasurementQuestions } from '@/Services/Steps'

const BasicMeasurementMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const questions = BasicMeasurementQuestions()
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

export default BasicMeasurementMedicalCaseContainer
