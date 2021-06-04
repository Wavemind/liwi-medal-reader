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
 * @param {integer} value
 * @param {integer} step
 * @returns
 */
export const round = (value, step) => {
  step || (step = 1.0)
  var inv = 1.0 / step
  return Math.round(value * inv) / inv
}

/**
 *
 * @param {*} mcNode
 * @param {*} node
 * @param {*} value
 * @returns
 */
const handleNumeric = (mcNode, node, value) => {
  let answer = null
  let roundedValue = null

  if (value === null) {
    answer = null
  } else if (mcNode.unavailableValue) {
    // Unavailable question
    answer = Number(value)
    value = node.answers[answer].value
  } else {
    // Normal process
    answer = findKey(node.answers, condition => {
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
    if (answer !== undefined) {
      answer = Number(answer)
    } else {
      answer = null
    }

    if (node?.round !== null) {
      roundedValue = round(value, node?.round)
    }
    return { answer, value, roundedValue }
  }
}

/**
 *
 * @param {*} node
 * @param {*} value
 * @returns
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
 *
 * @param {*} mcNode
 * @param {*} node
 * @param {*} value
 * @returns
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
  const { questionId, value } = props
  const {
    algorithm: {
      item: {
        nodes: { [questionId]: node },
      },
    },
    medicalCase: {
      item: {
        nodes: { [questionId]: mcNode },
      },
    },
    medicalCase: { item: medicalCase },
  } = store.getState()
  // Validation
  const newValues = setNodeValue(mcNode, node, value)
  return {
    ...medicalCase,
    nodes: {
      ...medicalCase.nodes,
      [questionId]: { ...mcNode, /*...validation, */ ...newValues },
    },
  }
}
