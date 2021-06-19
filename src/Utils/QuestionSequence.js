/**
 * The internal imports
 */
import { store } from '@/Store'
import {
  calculateCondition,
  reduceConditions,
  getTopConditions,
} from '@/Utils/MedicalCase'
import { scoredCalculateCondition } from '@/Utils/QuestionSequenceScore'
import { Config } from '@/Config'

/**
 * Calculate the value of a Question Sequence
 * @param {*} qsId : Id of the QS we want to calculate
 * @param {*} mcNodes : the current value of the medical case nodes
 * @returns
 * - return true if the QS is valid
 * - return false if the QS is not possible
 * - return null if we need to answer more question to define the outcome
 */
export const getQsValue = (qsId, newMcNodes) => {
  const nodes = store.getState().algorithm.item.nodes

  if (nodes[qsId].category === Config.CATEGORIES.scored) {
    return scoredCalculateCondition(qsId, newMcNodes)
  } else {
    const topConditions = getTopConditions(nodes[qsId].instances)

    const conditionsValues = topConditions.map(instance =>
      qsInstanceValue(instance, newMcNodes, nodes[qsId].instances, qsId),
    )
    return reduceConditions(conditionsValues)
  }
}

/**
 * Get the condition for an element at the bottom of a diagram final diagnosis / Question sequence
 * @param {Integer} nodeId : the node we want to test
 * @param {instance} mcNodes: the parent we are calling from
 * @param {Array<mcNode>} mcNodes: current medical case state
 * @returns
 */
export const diagramConditionsValues = (nodeId, instance, mcNodes) => {
  const nodes = store.getState().algorithm.item.nodes

  return nodes[nodeId].conditions
    .filter(condition => condition.node_id === instance.id)
    .map(condition => {
      if (mcNodes[condition.node_id].answer === null) {
        return null
      } else {
        return mcNodes[condition.node_id].answer === condition.answer_id
      }
    })
}

/**
 * Calculates the value of an instance in a question sequence
 * @param {Instance} instance : The instance we wanna handle
 * @param {Array<McNode>} newMcNodes : Current state of the medical case nodes
 * @param {Array<Instance>} instances : All the instances in the question sequence we are testing
 * @param {Integer} qsId : The Id of the qs we are testing
 * @returns {Boolean | null} the value of the instance in the question sequence (returns null if not answered yet)
 */
const qsInstanceValue = (instance, newMcNodes, instances, qsId) => {
  const mcNode = newMcNodes[instance.id]

  const instanceCondition = calculateCondition(instance)

  if (instanceCondition && mcNode.answer === null) {
    return null
  }

  if (instanceCondition) {
    if (isEndOfQS(instance.children, qsId)) {
      return reduceConditions(
        diagramConditionsValues(qsId, instance, newMcNodes),
      )
    } else {
      const childrenInstances = instance.children.map(child => instances[child])
      return reduceConditions(
        // TODO break if QS node  Values is yes for optimization
        childrenInstances.map(child =>
          qsInstanceValue(child, newMcNodes, instances, qsId),
        ),
      )
    }
  } else {
    return false
  }
}

/**
 * Tells if the children we are processing are the last child
 * @param {Array<instance>} children
 * @returns
 */
const isEndOfQS = (children, qsId) => {
  return children.find(childId => childId === qsId) !== undefined
}
