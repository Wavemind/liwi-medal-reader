/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { BasicMeasurementQuestions } from '@/Services/Steps'

const BasicMeasurementMedicalCaseContainer = props => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const [questions, setQuestions] = useState(BasicMeasurementQuestions())

  // Update questions list only if question array change
  useEffect(() => {
    const basicMeasurementQuestions = BasicMeasurementQuestions()
    if (!isEqual(basicMeasurementQuestions, questions)) {
      setQuestions(basicMeasurementQuestions)
    }
  }, [isFocused])

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
