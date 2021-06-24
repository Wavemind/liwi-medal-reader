/**
 * The external imports
 */
import React from 'react'
import { FlatList, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { QuestionItem } from '@/Components'
import removeQuestions from '@/Services/MedicalCase/RemoveQuestions'

const SummaryQuestions = () => {
  const { Gutters } = useTheme()

  const questions = removeQuestions()

  return (
    <View style={Gutters.regularHMargin}>
      <FlatList
        data={Object.values(questions)}
        renderItem={({ item }) => (
          <QuestionItem questions={questions} questionId={item.id} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default SummaryQuestions
