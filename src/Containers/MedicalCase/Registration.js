/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

/**
 * The internal imports
 */
import { Question } from '@/Components'
import { useTheme } from '@/Theme'

const RegistrationMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  const questions = _.filter(algorithm.nodes, {
    category: 'complaint_category',
  })

  // let questions = []
  // questions.push(algorithm.nodes[1])
  // questions.push(algorithm.nodes[18])
  // questions.push(algorithm.nodes[168])
  // questions.push(algorithm.nodes[326])
  // questions.push(algorithm.nodes[204])
  // questions.push(algorithm.nodes[1774])
  // questions.push(algorithm.nodes[3436])
  // questions.push(algorithm.nodes[6])
  // questions.push(algorithm.nodes[7])

  return (
    <View style={Gutters.regularTPadding}>
      <FlatList
        removeClippedSubviews={false}
        data={questions}
        renderItem={({ item }) => <Question node={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
