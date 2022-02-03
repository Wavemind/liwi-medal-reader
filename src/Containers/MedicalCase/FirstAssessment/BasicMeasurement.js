/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { BasicMeasurementQuestionsService } from '@/Services/Steps'

const BasicMeasurementMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const [questions, setQuestions] = useState(BasicMeasurementQuestionsService())
  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  // Update questions list only if question array change
  useEffect(() => {
    const basicMeasurementQuestions = BasicMeasurementQuestionsService()
    if (!isEqual(basicMeasurementQuestions, questions)) {
      setQuestions(basicMeasurementQuestions)
    }
  }, [isFocused, mcNodes])

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <Question questionId={item} />}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      removeClippedSubviews={false}
      keyExtractor={item => item}
    />
  )
}

export default BasicMeasurementMedicalCaseContainer
