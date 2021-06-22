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
import { TreatmentConditionsQuestions } from '@/Services/Steps'

const TreatmentConditionsMedicalCaseContainer = props => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  const [questions, setQuestions] = useState(TreatmentConditionsQuestions())

  // Update questions list only if question array change
  useEffect(() => {
    const treatmentConditionsQuestions = TreatmentConditionsQuestions()
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
