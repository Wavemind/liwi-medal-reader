/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { QuestionInfoButton } from '@/Components'
import { useTheme } from '@/Theme'

const SummaryQuestionItem = ({ questions, questionId }) => {
  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  const currentNode = nodes[questionId]
  const question = questions[questionId]
  const answer = currentNode.answers[question.answer]
    ? currentNode.answers[question.answer].label
    : ''

  return (
    <View style={patientPersonalInfo.textWrapper}>
      <View style={patientPersonalInfo.labelWrapper}>
        <Text style={patientPersonalInfo.label}>
          {translate(currentNode.label)}
        </Text>
        {translate(nodes[questionId].description) !== '' && (
          <QuestionInfoButton nodeId={questionId} />
        )}
      </View>
      <Text style={patientPersonalInfo.value}>{translate(answer)}</Text>
    </View>
  )
}

export default SummaryQuestionItem
