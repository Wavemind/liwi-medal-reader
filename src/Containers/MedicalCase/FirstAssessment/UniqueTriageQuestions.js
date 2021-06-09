/**
 * The external imports
 */
import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question } from '@/Components'

const UniqueTriageQuestionsMedicalCaseContainer = props => {
  const questions = useSelector(
    state => state.algorithm.item.config.full_order.first_look_assessment_step,
  )

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <Question questionId={item} />}
      keyExtractor={item => item.id}
    />
  )
}

export default UniqueTriageQuestionsMedicalCaseContainer
