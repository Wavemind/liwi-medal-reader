/**
 * The external imports
 */
import findKey from 'lodash/findKey'
import find from 'lodash/find'

/**
 * The internal imports
 */
import { Config } from '@/Config'

/**
 * Get yes answer based on reference
 * @param node - (algorithm or medical case node)
 */
export const getYesAnswer = node => {
  const { answers } = node
  const yesAnswerIndex = Object.keys(answers).findIndex(answerId => {
    const { reference } = answers[answerId]
    return reference === 1
  })

  return Object.values(answers)[yesAnswerIndex]
}

/**
 * Get no answer based on reference
 * @param node - (algorithm or medical case node)
 */
export const getNoAnswer = node => {
  const { answers } = node

  const noAnswerIndex = Object.keys(answers).findIndex(answerId => {
    const { reference } = answers[answerId]
    return reference === 2
  })

  return Object.values(answers)[noAnswerIndex]
}
/**
 * Round number
 * @param {integer} value : value to round
 * @param {integer} step :round precision
 * @returns {Float} : Rounded value
 */
export const round = (value, step) => {
  step || (step = 1.0)
  var inv = 1.0 / step
  return Math.round(value * inv) / inv
}

/**
 * Handles a new value for a numeric node will return the new values to set in the node
 * @param {MedicalCaseNode} mcNode : Current state of the node to update
 * @param {Node} node : Node definition in the algorithm
 * @param {any} value : New value of the node
 * @returns {
 *              {integer} answer : new id of the answer
 *              {string}  value : new value
 *              {integer} roundedValue? : Rounded value if the node requires a rounded value
 *   }
 */
export const handleNumeric = (mcNode, node, value) => {
  const response = { answer: null, value: value }
  const unavailableAnswer = find(node.answers, a => a.value === 'not_available')

  if (value === null) {
    response.answer = null
    response.value = ''
  } else if (
    mcNode.unavailableValue ||
    (unavailableAnswer && unavailableAnswer?.id === value)
  ) {
    // Unavailable question
    response.answer = Number(value)
    response.value = node.answers[response.answer].value
  } else {
    // Normal process
    response.answer = findKey(node.answers, condition => {
      switch (condition.operator) {
        case 'more_or_equal':
          return value >= Number(condition.value)
        case 'less':
          return value < Number(condition.value)
        case 'between':
          return (
            value >= Number(condition.value.split(',')[0]) &&
            value < Number(condition.value.split(',')[1])
          )
      }
    })
    if (response.answer !== undefined) {
      response.answer = Number(response.answer)
    } else {
      response.answer = null
    }

    if (node?.round !== null) {
      response.roundedValue = round(value, node?.round)
    }
  }
  return response
}

/**
 * Handles a new value for a answerId based node will return the new values to set in the node
 * @param {MedicalCaseNode} mcNode : Current state of the node to update
 * @param {Node} node : Node definition in the algorithm
 * @param {any} value : New value of the node
 * @returns {
 *              {integer} answer : new id of the answer
 *              {string}  value : new value
 *   }
 */
export const handleAnswerId = (node, value) => {
  let answer = null
  if (value !== null) {
    // Set Number only if this is a number
    if (/^\d+$/.test(value)) {
      answer = Number(value)
      value = node.answers[answer].value
    } else {
      answer = Object.values(node.answers).find(
        nodeAnswer => nodeAnswer.value === value,
      )
    }
  }
  return { answer, value }
}

/**
 * Based on the node value format it will return the new values to set in the store
 * @param {MedicalCaseNode} mcNode : Current state of the node to update
 * @param {Node} node : Node definition in the algorithm
 * @param {any} value : New value of the node
 * @returns See return of handleNumeric or handleAnswerId
 */
export const setNodeValue = (mcNode, node, value) => {
  const { int, float, bool, array, present, positive, string, date } =
    Config.VALUE_FORMATS
  switch (node.value_format) {
    case int:
    case float:
    case date:
      return handleNumeric(mcNode, node, value)
    case bool:
    case array:
    case present:
    case positive:
      return handleAnswerId(node, value)
    case string:
      return { answer: null, value }
    default:
      console.error('FORMAT NOT HANDLED')
      return { answer: null, value: null }
  }
}
