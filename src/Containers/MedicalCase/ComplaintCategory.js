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
import { Question } from '@/Components'
import { useTheme } from '@/Theme'

const ComplaintCategoryMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  const questions = filter(algorithm.nodes, {
    category: 'complaint_category',
  })

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

export default ComplaintCategoryMedicalCaseContainer
