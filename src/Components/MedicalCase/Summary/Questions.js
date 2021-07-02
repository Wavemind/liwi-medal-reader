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

  const questions = RemoveQuestionService()

  return (
    <View style={Gutters.regularHMargin}>
      <FlatList
        data={Object.values(questions)}
        renderItem={({ item }) => (
          <SummaryQuestionItem questions={questions} questionId={item.id} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default SummaryQuestions
