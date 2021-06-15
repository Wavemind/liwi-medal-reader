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
import { store } from '@/Store'
import { getYesAnswer, getNoAnswer } from '@/Utils/Answers'

export default ({ nodeId, newNodes }) => {
  const nodes = store.getState().algorithm.item.nodes

  /**
   *
   * @param {*} children
   * @returns
   */
  const isEndOfQS = (children, qsId) => {
    return children.find(childId => childId === qsId) !== undefined
  }

  const qsNodeValue = (instance, newMcNodes, instances, qsId) => {
    const nodes = store.getState().algorithm.item.nodes

    const mcNode = newMcNodes[instance.id]
    if (mcNode.answer === null) {
      return null
    }
    const instanceCondition = calculateCondition(instance)
    if (instanceCondition) {
      if (isEndOfQS(instance.children, qsId)) {
        const reducedConditions = nodes[qsId].conditions.map(condition => {
          if (newMcNodes[condition.node_id].answer === null) {
            return null
          } else {
            return newMcNodes[condition.node_id].answer === condition.answer_id
          }
        })
        return reduceConditions(reducedConditions)
      } else {
        const childrenInstances = instance.children.map(
          child => instances[child],
        )
        console.log(qsId, childrenInstances, instance.children, instances)
        return reduceConditions(
          // TODO break if QS node  Values is yes for optimization
          childrenInstances.map(child =>
            qsNodeValue(child, newMcNodes, instances, qsId),
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
      qsNodeValue(instance, newMcNodes, nodes[qsId].instances, qsId),
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
        ? getYesAnswer(nodes[qsId]).id
        : getNoAnswer(nodes[qsId]).id

      const newQsValues = handleAnswerId(nodes[qsId], qsValue)

      // Set the qs Value in the store
      newNodes[qsId] = { ...newNodes[qsId], ...newQsValues }
    } else {
      newNodes[qsId] = { ...newNodes[qsId], value: null, answer: null }
    }

    // Add the related QS to the QS processing list
    // TODO QSS
    const newQsList = nodes[qsId].qs.filter(
      childId => !excludedByCC(childId, nodes, newNodes),
    )

    console.log(qsId, newQsList, nodes[qsId].qs)
    qsToUpdate = qsToUpdate.concat(newQsList)

    // uniq to avoid processing same Qs multiple time
    // Slice to remove element we just handled
    qsToUpdate = uniq(qsToUpdate.slice(1))
  }
  return newNodes
}
