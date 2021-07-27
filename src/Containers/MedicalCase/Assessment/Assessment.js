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
import { debugNode } from '@/Utils/MedicalCase'

const AssessmentMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  const [questions, setQuestions] = useState(AssessmentQuestionsService())

  debugNode(6186)
  // debugNode(6185)
  // debugNode(6183)
  // debugNode(6184)
  // debugNode(6182)
  // debugNode(6180)
  // debugNode(6175)
  // debugNode(6181)
  // debugNode(6153)
  // debugNode(6178)
  // debugNode(6176)
  // debugNode(6173)
  // debugNode(6174)
  // debugNode(6145)
  // debugNode(7266)
  debugNode(6148)
  debugNode(6142)
  debugNode(6476)

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
