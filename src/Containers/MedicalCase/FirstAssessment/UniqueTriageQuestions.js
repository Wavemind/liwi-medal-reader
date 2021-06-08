/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question } from '@/Components'

const UniqueTriageQuestionsMedicalCaseContainer = props => {
  // TODO: MUST BE CHANGE WITH ORDER GIVEN BY MANU !
  const questions = useSelector(
    state =>
      state.algorithm.item.mobile_config.questions_orders.first_look_assessment,
  )

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default UniqueTriageQuestionsMedicalCaseContainer
