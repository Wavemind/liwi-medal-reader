/**
 * The external imports
 */
import React from 'react'
import { FlatList, View } from 'react-native'
import { useSelector } from 'react-redux'
import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { QuestionItem } from '@/Components'
import { Config } from '@/Config'

const PersonalInfoPatientContainer = () => {
  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  const nodes = useSelector(state => state.medicalCase.item.nodes)
  const algorithm = useSelector(state => state.algorithm.item)
  const birthDate = useSelector(state => state.patient.item.birth_date)

  // Remove / Keep neonat question based on patient age
  const questions = { ...nodes }
  const neonatCCs = algorithm.mobile_config.questions_orders[
    Config.STEP_ORDERS.complaintCategories
  ].filter(ccId => algorithm.nodes[ccId].is_neonat)
  const days = birthDate ? differenceInDays(startOfToday(), birthDate) : 0

  Object.keys(nodes).forEach(nodeId => {
    const mcNode = algorithm.nodes[nodeId]
    // If patient is older than 60 days, we remove YI questions
    // Or if nodeId is a QuestionsSequence, we remove the question
    if (
      (days > 60 &&
        mcNode.conditioned_by_cc !== undefined &&
        mcNode.conditioned_by_cc.length > 0 &&
        mcNode.conditioned_by_cc.some(ccId => neonatCCs.includes(ccId))) ||
      mcNode.type === 'QuestionsSequence'
    ) {
      delete questions[parseInt(nodeId, 10)]
    }
  })

  return (
    <View style={[patientPersonalInfo.wrapper]}>
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

export default PersonalInfoPatientContainer
