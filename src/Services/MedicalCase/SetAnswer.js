/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import validationMedicalCaseService from '@/Services/MedicalCase/Validation'
import { setNodeValue } from '@/Utils/Answers'
import UpdateQuestionSequence from '@/Services/MedicalCase/UpdateQuestionSequence'
import UpdateRelatedQuestion from '@/Services/MedicalCase/UpdateRelatedQuestion'

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
  const validation = validationMedicalCaseService(mcNode, node, value)

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

  // For the fucking life of me I couldn't find an easier way to do this shit
  const newActivities = newMedicalCase.activities.map((activity, i) => {
    if (i === newMedicalCase.activities.length - 1) {
      return {
        ...activity,
        questions: [
          ...activity.questions,
          {
            nodeId,
            previousValue: newMedicalCase.nodes[nodeId].answer,
            newValue: value,
          },
        ],
      }
    } else {
      return activity
    }
  })

  return {
    ...newMedicalCase,
    activities: [...newActivities],
    nodes: {
      ...newNodes,
    },
  }
}
