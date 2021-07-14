/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { TreatmentConditionsQuestionsService } from '@/Services/Steps'

const TreatmentConditionsMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  const [questions, setQuestions] = useState(
    TreatmentConditionsQuestionsService(),
  )

  // Update questions list only if question array change
  useEffect(() => {
    const treatmentConditionsQuestions = TreatmentConditionsQuestionsService()
    if (!isEqual(treatmentConditionsQuestions, questions)) {
      setQuestions(treatmentConditionsQuestions)
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

export default TreatmentConditionsMedicalCaseContainer
