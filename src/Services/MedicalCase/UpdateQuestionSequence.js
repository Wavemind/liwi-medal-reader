/**
 * The external imports
 */
/**
 * The internal imports
 */
import {
  handleAnswerId,
  uniq,
  excludedByCC,
  calculateCondition,
  reduceConditions,
  getTopConditions,
} from '@/Utils/MedicalCase'
import { Config } from '@/Config'

export default ({ nodeId, nodes, newNodes }) => {
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

  const qsNodeValue = (instance, newMcNodes, instances) => {
    const mcNode = newMcNodes[instance.id]
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
            qsNodeValue(child, newMcNodes, instances),
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
  const getQsValue = (qsId, newMcNodes) => {
    const topConditions = getTopConditions(nodes[qsId].instances)

    const conditionsValues = topConditions.map(instance =>
      qsNodeValue(instance, newMcNodes, nodes[qsId].instances),
    )

    return reduceConditions(conditionsValues)
  }

  // List of QS we need to update
  let qsToUpdate = nodes[nodeId].qs

  while (qsToUpdate.length > 0) {
    const qsId = qsToUpdate[0]
    const qsBooleanValue = getQsValue(qsId, newNodes)

    // If the QS has a value
    if (qsBooleanValue !== null) {
      const qsValue = qsBooleanValue
        ? nodes[qsId].answers[0]
        : nodes[qsId].answers[1]

      // Add the related QS to the QS processing list
      // TODO QSS
      const newQsList = nodes[qsId].qs.filter(childId => {
        !excludedByCC(childId, nodes, newNodes)
      })
      qsToUpdate = qsToUpdate.concat(newQsList)
      const newQsValues = handleAnswerId(nodes[qsId], qsValue)

      // Set the qs Value in the store
      newNodes[qsId] = { ...newNodes[qsId], ...newQsValues }
    }

    // uniq to avoid processing same Qs multiple time
    // Slice to remove element we just handled
    qsToUpdate = uniq(qsToUpdate.slice(1))

    return newNodes
  }
}
