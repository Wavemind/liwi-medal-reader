/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { Question } from '@/Components'
import { UniqueTriageQuestionsService } from '@/Services/Steps'

const UniqueTriageQuestionsMedicalCaseContainer = () => {
  const isFocused = useIsFocused()

  const [questions, setQuestions] = useState(UniqueTriageQuestionsService())
  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  // Update questions list only if question array change
  useEffect(() => {
    const utqQuestions = UniqueTriageQuestionsService()
    if (!isEqual(utqQuestions, questions)) {
      setQuestions(utqQuestions)
    }
  }, [isFocused, mcNodes])

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <Question questionId={item} />}
      removeClippedSubviews={false}
      keyExtractor={item => item}
    />
  )
}

export default UniqueTriageQuestionsMedicalCaseContainer
