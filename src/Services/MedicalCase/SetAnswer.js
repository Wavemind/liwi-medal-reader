/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import validationMedicalCaseService from '@/Services/MedicalCase/Validation'
import {
  getTopConditions,
  calculateCondition,
  reduceConditions,
  uniq,
  handleAnswerId,
  setNodeValue,
} from '@/Utils/MedicalCase'

export default async props => {
  const { nodeId, value } = props
  let newValues = {}

  const {
    algorithm: {
      item: { nodes },
    },
    medicalCase: { item: newMedicalCase },
  } = store.getState()
  const node = nodes[nodeId]

  /**
   *
   * @param {*} children
   * @returns
   */
  const isEndOfQS = children => {
    return (
      children.find(
        childId => nodes[childId].type === Config.NODE_TYPES.questionsSequence,
      ) !== undefined
    )
  }

  const qsNodeValue = (instance, mcNodes, instances) => {
    const mcNode = mcNodes[instance.id]
    if (mcNode.answer === null) {
      return null
    }
    const instanceCondition = calculateCondition(instance)
    if (instanceCondition) {
      if (isEndOfQS(instance.children)) {
        return true
      } else {
        const childrenInstances = instance.children.map(
          child => instances[child],
        )
        return reduceConditions(
          // TODO break if QS node  Values is yes for optimization
          childrenInstances.map(child =>
            qsNodeValue(child, mcNodes, instances),
          ),
        )
      }
    } else {
      return false
    }
  }

  /**
   * Calculate the value of a Question Sequence
   * @param {*} qsId : Id of the QS we want to calculate
   * @param {*} mcNodes : the current value of the medical case nodes
   * @returns
   * - return true if the QS is valid
   * - return false if the QS is not possible
   * - return null if we need to answer more question to define the outcome
   */
  const getQsValue = (qsId, mcNodes) => {
    const topConditions = getTopConditions(nodes[qsId].instances)

    const conditionsValues = topConditions.map(instance =>
      qsNodeValue(instance, mcNodes, nodes[qsId].instances),
    )

    return reduceConditions(conditionsValues)
  }

  const mcNode = newMedicalCase.nodes[nodeId]
  // TODO find another way
  let newNodes = JSON.parse(JSON.stringify(newMedicalCase.nodes))

  // Validation
  const validation = await validationMedicalCaseService(mcNode, node, value)

  // Save value only if validation pass
  if (validation.validationType !== 'error') {
    newValues = setNodeValue(mcNode, node, value)
  }

  // Sets the value of the node we just answered
  newNodes[nodeId] = {
    ...mcNode,
    ...validation,
    ...newValues,
  }

  // List of QS we need to update
  let qsToUpdate = node.qs

  while (qsToUpdate.length > 0) {
    const qsId = qsToUpdate[0]
    const qsBooleanValue = getQsValue(qsId, newNodes)

    // If the QS has a value
    if (qsBooleanValue !== null) {
      const qsValue = qsBooleanValue
        ? nodes[qsId].answers[0]
        : nodes[qsId].answers[1]

      // Add the related QS to the QS processing list
      qsToUpdate = qsToUpdate.concat(nodes[qsId].qs)
      const newQsValues = handleAnswerId(nodes[qsId], qsValue)

      // Set the qs Value in the store
      newNodes[qsId] = { ...newNodes[qsId], ...newQsValues }
    }

    // uniq to avoid processing same Qs multiple time
    // Slice to remove element we just handled
    qsToUpdate = uniq(qsToUpdate.slice(1))
  }
  return {
    ...newMedicalCase,
    nodes: {
      ...newNodes,
    },
  }
}
