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

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  const currentNode = nodes[nodeId]
  console.log(nodeId, currentNode)
  const answer = currentNode.answers[mcNodes[nodeId].answer]
    ? translate(currentNode.answers[mcNodes[nodeId].answer].label)
    : mcNodes[nodeId].value

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
