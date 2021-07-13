/**
 * The external imports
 */
import React from 'react'
import { FlatList, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SummaryQuestionItem } from '@/Components'
import { RemoveQuestionService } from '@/Services/MedicalCase'

const SummaryQuestions = () => {
  const { Gutters } = useTheme()

  const answeredQuestions = Object.values(RemoveQuestionService()).filter(
    question => {
      return question.answer || question.value !== ''
    },
  )

  return (
    <View style={Gutters.regularHMargin}>
      <FlatList
        data={answeredQuestions}
        renderItem={({ item }) => <SummaryQuestionItem question={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default SummaryQuestions
