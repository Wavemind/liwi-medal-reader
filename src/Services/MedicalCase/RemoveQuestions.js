import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'

import { store } from '@/Store'

/**
 * Removes neonat questions (if needed) and questions sequences for medicalCase nodes
 * @returns {*}
 */
export default () => {
  const nodes = store.getState().medicalCase.item.nodes
  const algorithm = store.getState().algorithm.item
  const birthDate = store.getState().patient.item.birth_date

  const questions = { ...nodes }
  const neonatCCs = algorithm.config.full_order.complaint_categories_step.neonat

  const days = birthDate ? differenceInDays(startOfToday(), birthDate) : 0

  // Remove / Keep neonat question based on patient age
  Object.keys(nodes).forEach(nodeId => {
    const mcNode = algorithm.nodes[nodeId]
    // If patient is older than 60 days, we remove YI questions
    // Or if nodeId is a QuestionsSequence, we remove the question
    if (
      (days > 60 &&
        mcNode.conditioned_by_cc !== undefined &&
        mcNode.conditioned_by_cc.length > 0 &&
        mcNode.conditioned_by_cc.some(ccId => neonatCCs.includes(ccId))) ||
      mcNode.type === 'QuestionsSequence'
    ) {
      delete questions[parseInt(nodeId, 10)]
    }
  })
  return questions
}
