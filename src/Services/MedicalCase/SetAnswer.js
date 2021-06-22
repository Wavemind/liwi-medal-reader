/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import QuestionValidationService from '@/Services/Validation/Question'
import { setNodeValue } from '@/Utils/Answers'
import UpdateQuestionSequence from '@/Services/MedicalCase/UpdateQuestionSequence'
import UpdateRelatedQuestion from '@/Services/MedicalCase/UpdateRelatedQuestion'
import AddActivityService from '@/Services/Activity/Add'

export default props => {
  const { nodeId, value } = props
  let newValues = {}

  const {
    algorithm: {
      item: { nodes },
    },
    medicalCase: { item: newMedicalCase },
  } = store.getState()
  const node = nodes[nodeId]

  const mcNode = newMedicalCase.nodes[nodeId]
  // TODO find another way
  let newNodes = JSON.parse(JSON.stringify(newMedicalCase.nodes))

  // Validation
  const validation = QuestionValidationService(mcNode, node, value)

  // Early return if there is an error in the validation
  if (validation.validationType === 'error') {
    return {
      ...newMedicalCase,
      nodes: {
        ...newMedicalCase.nodes,
        [node.id]: {
          ...mcNode,
          ...validation,
        },
      },
    }
  }

  // Set the new value to the current node
  newValues = setNodeValue(mcNode, node, value)
  newNodes[nodeId] = {
    ...mcNode,
    ...validation,
    ...newValues,
  }

  newNodes = UpdateQuestionSequence({ nodeId: node.id, newNodes })
  newNodes = UpdateRelatedQuestion({ nodeId: node.id, newNodes })

  const newActivities = AddActivityService({
    medicalCase: newMedicalCase,
    nodeId,
    value,
  })

  return {
    ...newMedicalCase,
    activities: [...newActivities],
    nodes: {
      ...newNodes,
    },
  }
}
