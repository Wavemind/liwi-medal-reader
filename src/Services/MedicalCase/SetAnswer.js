/**
 * The external imports
 */

import findKey from 'lodash/findKey'

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'

/**
 * Round number
 * @param {integer} value : value to round
 * @param {integer} step :round precision
 * @returns
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
const handleNumeric = (mcNode, node, value) => {
  const response = { answer: null, value: value }

  if (value === null) {
    response.answer = null
  } else if (mcNode.unavailableValue) {
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
            value >= Number(condition.value.split(',').first()) &&
            value < Number(condition.value.split(',').second())
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
    return response
  }
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
const handleAnswerId = (node, value) => {
  let answer = null

  // Set Number only if this is a number
  if (value === null) {
    // Set the new answer to null for reset
    answer = null
  } else if (/^\d+$/.test(value)) {
    answer = Number(value)
    value = node.answers[answer].value
  } else {
    answer = Object.values(node.answers).find(
      nodeAnswer => nodeAnswer.value === value,
    )
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
const setNodeValue = (mcNode, node, value) => {
  const { int, float, bool, array, present, positive } = Config.VALUE_FORMATS

  switch (node.value_format) {
    case int:
    case float:
      return handleNumeric(mcNode, node, value)
    case bool:
    case array:
    case present:
    case positive:
      return handleAnswerId(node, value)
  }
}

export default async props => {
  const { nodeId, value } = props
  const {
    algorithm: {
      item: {
        nodes: { [nodeId]: node },
      },
    },
    medicalCase: { item: medicalCase },
  } = store.getState()
  const mcNode = medicalCase.nodes[nodeId]

  // Validation
  const newValues = setNodeValue(mcNode, node, value)
  return {
    ...medicalCase,
    nodes: {
      ...medicalCase.nodes,
      [nodeId]: { ...mcNode, /*...validation, */ ...newValues },
    },
  }
}
