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

const BasicMeasurementMedicalCaseContainer = props => {
  const algorithm = useSelector(state => state.algorithm.item)

  const questions =
    algorithm.mobile_config.questions_orders.basic_measurements.map(
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

export default BasicMeasurementMedicalCaseContainer
