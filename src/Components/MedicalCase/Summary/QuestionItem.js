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

const SummaryQuestionItem = ({ nodeId }) => {
  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  const currentNode = useSelector(state => state.algorithm.item.nodes[nodeId])
  const mcNode = useSelector(state => state.medicalCase.item.nodes[nodeId])

  if (
    mcNode === undefined ||
    (mcNode?.answer === null && mcNode?.value === '')
  ) {
    return null
  }

  const answer = currentNode.answers[mcNode.answer]
    ? translate(currentNode.answers[mcNode.answer].label)
    : mcNode.value

  return (
    <View style={patientPersonalInfo.textWrapper}>
      <View style={patientPersonalInfo.labelWrapper}>
        <Text style={patientPersonalInfo.label}>
          {translate(currentNode.label)}
        </Text>
        {(translate(currentNode.description) !== '' ||
          currentNode.medias?.length > 0) && (
          <QuestionInfoButton nodeId={nodeId} />
        )}
      </View>
      <Text style={patientPersonalInfo.value}>{answer}</Text>
    </View>
  )
}

export default SummaryQuestionItem
