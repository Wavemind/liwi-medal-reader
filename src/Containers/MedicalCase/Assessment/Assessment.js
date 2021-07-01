/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { AssessmentQuestionsService } from '@/Services/Steps'

const AssessmentMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  const [questions, setQuestions] = useState(AssessmentQuestionsService())

  // Update questions list only if question array change
  useEffect(() => {
    const assessmentQuestions = AssessmentQuestionsService()
    if (!isEqual(assessmentQuestions, questions)) {
      setQuestions(assessmentQuestions)
    }
  }, [isFocused, mcNodes])

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        ListEmptyComponent={
          <EmptyList text={t('containers.medical_case.no_questions')} />
        }
        removeClippedSubviews={false}
        keyExtractor={item => item}
      />
    </View>
  )
}

export default AssessmentMedicalCaseContainer
