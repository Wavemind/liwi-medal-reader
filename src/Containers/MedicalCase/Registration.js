/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import filter from 'lodash/filter'

/**
 * The internal imports
 */
import { Question, Consent } from '@/Components'
import { useTheme } from '@/Theme'

const RegistrationMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  const questions = filter(algorithm.nodes, { category: 'basic_demographic' })
  // let questions = []
  // questions.push(algorithm.nodes[18])
  // questions.push(algorithm.nodes[168])
  // questions.push(algorithm.nodes[326])
  // questions.push(algorithm.nodes[204])

  return (
    <View style={Gutters.regularTPadding}>
      <FlatList
        ListHeaderComponent={<Consent />}
        data={questions}
        renderItem={({ item }) => <Question node={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
