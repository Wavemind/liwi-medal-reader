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

const UniqueTriageQuestionsMedicalCaseContainer = props => {
  const questions = UniqueTriageQuestions()

  console.log(questions)

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <Question questionId={item} />}
      keyExtractor={item => item}
    />
  )
}

export default UniqueTriageQuestionsMedicalCaseContainer
