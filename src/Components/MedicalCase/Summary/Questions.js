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
import { BasicMeasurementQuestionsService } from '@/Services/Steps'

const SummaryQuestions = () => {
  const { Gutters } = useTheme()

  console.log(BasicMeasurementQuestionsService())

  const answeredQuestions = Object.values(RemoveQuestionService()).filter(
    question => {
      return question.answer || question.value !== ''
    },
  )

  return (
    
    <FlatList
      data={BasicMeasurementQuestionsService()}
      renderItem={({ item }) => <SummaryQuestionItem nodeId={item} />}
      keyExtractor={item => item}
    />
  )
}

export default SummaryQuestions
