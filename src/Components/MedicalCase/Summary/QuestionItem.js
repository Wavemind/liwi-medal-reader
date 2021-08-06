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

const SummaryQuestionItem = ({ question }) => {
  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  const currentNode = nodes[question.id]
  const answer = currentNode.answers[question.answer]
    ? translate(currentNode.answers[question.answer].label)
    : question.value

  return (
    <View style={patientPersonalInfo.textWrapper}>
      <View style={patientPersonalInfo.labelWrapper}>
        <Text style={patientPersonalInfo.label}>
          {translate(currentNode.label)}
        </Text>
        {(translate(currentNode.description) !== '' ||
          currentNode.medias?.length > 0) && (
          <QuestionInfoButton nodeId={question.id} />
        )}
      </View>
      <Text style={patientPersonalInfo.value}>{answer}</Text>
    </View>
  )
}

export default SummaryQuestionItem
