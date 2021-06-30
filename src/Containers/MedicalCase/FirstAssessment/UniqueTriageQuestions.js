/**
 * The external imports
 */
import React from 'react'
import { FlatList } from 'react-native'

/**
 * The internal imports
 */
import { Question } from '@/Components'
import { UniqueTriageQuestions } from '@/Services/Steps'

const UniqueTriageQuestionsMedicalCaseContainer = () => {
  const questions = UniqueTriageQuestions()

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
