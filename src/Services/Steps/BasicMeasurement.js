/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { getYesAnswer } from '@/Utils/Answers'

export default () => {
  const state = store.getState()
  const order = state.algorithm.item.config.full_order.basic_measurements_step
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes

  console.log(mcNodes)
  console.log(order)
  const newQuestions = order.filter(questionId => {
    if (nodes[questionId].conditioned_by_cc.length > 0) {
      // If one of the CC is true it means we need to exclude the question
      console.log()
      return !nodes[questionId].conditioned_by_cc.some(
        ccId => mcNodes[ccId].answer === getYesAnswer(nodes[ccId]).id,
      )
    }
    return true
  })
  return newQuestions
}
