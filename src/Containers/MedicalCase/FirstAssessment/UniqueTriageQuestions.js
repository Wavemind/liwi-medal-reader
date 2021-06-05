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
  const algorithm = useSelector(state => state.algorithm.item)

  const questions =
    algorithm.mobile_config.questions_orders.first_look_assessment.map(
      nodeId => algorithm.nodes[nodeId],
    )

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question node={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default UniqueTriageQuestionsMedicalCaseContainer
