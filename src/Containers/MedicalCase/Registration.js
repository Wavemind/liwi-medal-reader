/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question, Consent } from '@/Components'

const RegistrationMedicalCaseContainer = props => {
  const medicalCase = useSelector(state => state.medicalCase.item)

  let questions = []
  questions.push(medicalCase.nodes[1])
  questions.push(medicalCase.nodes[18])
  questions.push(medicalCase.nodes[168])
  questions.push(medicalCase.nodes[326])
  questions.push(medicalCase.nodes[204])
  questions.push(medicalCase.nodes[1774])
  questions.push(medicalCase.nodes[3436])
  questions.push(medicalCase.nodes[6])
  questions.push(medicalCase.nodes[7])

  return (
    <View>
      <FlatList
        removeClippedSubviews={false}
        ListHeaderComponent={<Consent />}
        data={questions}
        renderItem={({ item }) => <Question node={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
