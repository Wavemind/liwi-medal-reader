/**
 * The internal imports
 */
import { uniq, excludedByCC } from '@/Utils/MedicalCase'
import { getQsValue } from '@/Utils/QuestionSequence'
import { store } from '@/Store'
import { getYesAnswer, getNoAnswer, handleAnswerId } from '@/Utils/Answers'

export default ({ nodeId, newNodes, mcNodes }) => {
  const nodes = store.getState().algorithm.item.nodes

  // List of QS we need to update
  let qsToUpdate = nodes[nodeId].qs

  while (qsToUpdate.length > 0) {
    const qsId = qsToUpdate[0]
    const qsBooleanValue = getQsValue(qsId, { ...mcNodes, ...newNodes })

    // If the QS has a value
    if (qsBooleanValue !== null) {
      const qsValue = qsBooleanValue
        ? getYesAnswer(nodes[qsId]).id
        : getNoAnswer(nodes[qsId]).id

      const newQsValues = handleAnswerId(nodes[qsId], qsValue)

      // Set the qs Value in the store
      newNodes[qsId] = { ...mcNodes[qsId], ...newQsValues }
    } else {
      newNodes[qsId] = { ...mcNodes[qsId], value: null, answer: null }
    }

    // Add the related QS to the QS processing list
    const newQsList = nodes[qsId].qs.filter(childId => !excludedByCC(childId))

    qsToUpdate = qsToUpdate.concat(newQsList)

    // uniq to avoid processing same Qs multiple time
    // Slice to remove element we just handled
    qsToUpdate = uniq(qsToUpdate.slice(1))
  }
  return newNodes
}
