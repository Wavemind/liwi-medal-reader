/**
 * The internal imports
 */
import { store } from '@/Store'
import {
  calculateCondition,
  reduceConditions,
  respectsCutOff,
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
    //const topConditions = getTopConditions(nodes[qsId].instances)
    if (qsId === 38) {
      console.info(nodes[qsId])
    }
    const conditionsValues = nodes[qsId].conditions.map(condition => {
      if (
        newMcNodes[condition.node_id].answer === condition.answer_id &&
        respectsCutOff(condition.cut_off_start, condition.cut_off_end)
      ) {
        return qsInstanceValue(
          nodes[qsId].instances[condition.node_id],
          newMcNodes,
          nodes[qsId].instances,
          qsId,
        )
      } else {
        return false
      }
    })
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
  const instanceCondition = calculateCondition(instance, null, newMcNodes)

  if (instanceCondition && mcNode.answer === null) {
    return null
  }
  if (qsId === 6496) {
    console.info(
      instance,
      instanceCondition,
      instances,
      newMcNodes[instance.id],
    )
  }
  if (instanceCondition) {
    if (instance.conditions.length === 0) {
      return true
    }

    const parents = instance.conditions.filter(
      condition =>
        newMcNodes[condition.node_id].answer === condition.answer_id &&
        respectsCutOff(condition.cut_off_start, condition.cut_off_end),
    )
    if (parents.length === 0) {
      return false
    } else {
      const parentsCondition = parents.map(parent =>
        qsInstanceValue(instance[parent.id], newMcNodes, instances, qsId),
      )
      return reduceConditions(parentsCondition)
    }
  } else {
    return false
  }
}
