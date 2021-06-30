/**
 * The internal imports
 */
import { store } from '@/Store'
import {
  calculateCondition,
  reduceConditions,
  getTopConditions,
  diagramConditionsValues,
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
    const children = instance.children
      .filter(child => instances[child])
      .map(child => instances[child])

    const childrenConditions = children.map(child =>
      qsInstanceValue(child, newMcNodes, instances, qsId),
    )

    const finalDiagnosesConditions = diagramConditionsValues(
      qsId,
      instance,
      newMcNodes,
    )
    return reduceConditions(childrenConditions.concat(finalDiagnosesConditions))
  } else {
    return false
  }
}
