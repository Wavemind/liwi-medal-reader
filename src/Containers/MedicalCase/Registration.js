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
import { Question, SquareButton } from '@/Components'
import { useTheme } from '@/Theme'

const RegistrationMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  // const questions = _.filter(algorithm.nodes, { category: 'physical_exam' })
  let questions = []
  questions.push(algorithm.nodes[18])
  questions.push(algorithm.nodes[168])
  questions.push(algorithm.nodes[326])
  questions.push(algorithm.nodes[204])

  return (
    <View style={Gutters.regularTPadding}>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question node={item} />}
        keyExtractor={item => item.id}
      />
      <SquareButton
        label="Diagnoses"
        fullWidth={false}
        onPress={() => props.navigation.navigate('Diagnoses')}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
