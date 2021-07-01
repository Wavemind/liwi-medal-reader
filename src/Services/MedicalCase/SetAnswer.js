/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { QuestionValidationService } from '@/Services/Validation'
import { setNodeValue } from '@/Utils/Answers'
import {
  UpdateQuestionSequenceService,
  UpdateRelatedQuestionService,
} from '@/Services/MedicalCase'
import { AddActivityService } from '@/Services/Activity'

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

  newNodes = UpdateQuestionSequenceService({ nodeId: node.id, newNodes })
  newNodes = UpdateRelatedQuestionService({ nodeId: node.id, newNodes })

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
