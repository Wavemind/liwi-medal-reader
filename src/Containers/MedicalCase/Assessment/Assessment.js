/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { AssessmentQuestionsService } from '@/Services/Steps'
import { debugNode } from '@/Utils/MedicalCase'

const AssessmentMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const [questions, setQuestions] = useState(AssessmentQuestionsService())

  debugNode(3545)
  debugNode(4530)
  debugNode(5092)

  // Update questions list only if question array change
  useEffect(() => {
    const assessmentQuestions = AssessmentQuestions()
    if (!isEqual(assessmentQuestions, questions)) {
      setQuestions(assessmentQuestions)
    }
  }, [isFocused])

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
