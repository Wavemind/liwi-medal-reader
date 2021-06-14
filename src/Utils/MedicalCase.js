/**
 * The external imports
 */
import reduce from 'lodash/reduce'
import findKey from 'lodash/findKey'

/**
 * The internal imports
 */
import { getYesAnswer } from '@/Utils/Answers'
import { store } from '@/Store'
import { Config } from '@/Config'

export const getValidDiagnostics = (diagnostics, mcNodes, nodes) => {
  return Object.values(diagnostics).filter(
    diagnostic =>
      mcNodes[diagnostic.complaint_category].answer ===
      getYesAnswer(nodes[diagnostic.complaint_category]).id,
    // Handle des cutoffs
  )
}

export const getTopConditions = instances => {
  return Object.values(instances).filter(
    instance =>
      instance.conditions.length === 0 && instance.final_diagnostic_id === null,
  )
}
/**
 * TODO
 * @param {*} systemOrder
 * @param {*} questionsPerSystem
 * @returns
 */
export const orderSystems = (systemOrder, questionsPerSystem) => {
  const orderedSystem = []
  systemOrder.forEach(system => {
    if (
      questionsPerSystem[system.title] &&
      questionsPerSystem[system.title].length > 0
    ) {
      orderedSystem.push({
        title: system.title,
        data: uniq(system.data).filter(data =>
          questionsPerSystem[system.title].includes(data),
        ),
      })
    }
  })
  return orderedSystem
}

/**
 * TODO
 * @param {*} children
 * @param {*} questionPerSystems
 * @param {*} nodes
 * @param {*} diagnostic
 * @param {*} categories
 */
export const handleChildren = (
  children,
  questionPerSystems,
  nodes,
  instances,
  categories,
) => {
  console.log(children, nodes, instances)
  children.forEach(instance => {
    if (
      instance.conditions.length === 0 ||
      calculateCondition(instance) ||
      nodes[instance.id].category === Config.CATEGORIES.backgroundCalculation // C'est pour faire semblant que les BC sont répondues
    ) {
      addQuestionToSystem(instance.id, questionPerSystems, nodes, categories)
      if (
        nodes[instance.id].category === Config.CATEGORIES.predefinedSyndrome
      ) {
        const topConditions = getTopConditions(nodes[instance.id].instances)
        console.log(instance.id, nodes[instance.id], topConditions)
        console.log('la')
        handleChildren(
          topConditions,
          questionPerSystems,
          nodes,
          nodes[instance.id].instances,
          categories,
        )
      }

      const childrenInstance = instance.children
        .filter(
          child => nodes[child].type !== Config.NODE_TYPES.finalDiagnostic,
        )
        .map(child => instances[child])
      console.log('ICI', instance.children, childrenInstance, instances)
      if (childrenInstance.length > 0) {
        handleChildren(
          childrenInstance,
          questionPerSystems,
          nodes,
          instances,
          categories,
        )
      }
    }
  })
}

/**
 * TODO
 * @param {*} questionId
 * @param {*} questionPerSystems
 * @param {*} nodes
 * @param {*} categories
 */
export const addQuestionToSystem = (
  questionId,
  questionPerSystems,
  nodes,
  categories,
) => {
  if (categories.includes(nodes[questionId].category)) {
    if (nodes[questionId].system in questionPerSystems) {
      questionPerSystems[nodes[questionId].system].push(questionId)
    } else {
      questionPerSystems[nodes[questionId].system] = [questionId]
    }
  }
}

/**
 * TODO
 * @param {*} instance
 * @returns
 */
export const calculateCondition = instance => {
  const state = store.getState()
  const mcNodes = state.medicalCase.item.nodes
  const nodes = state.algorithm.item.nodes
  if (instance.conditions.length === 0) {
    return true
  }
  return instance.conditions.some(condition => {
    return (
      mcNodes[condition.node_id].answer === condition.answer_id ||
      nodes[condition.node_id].category ===
        Config.CATEGORIES.backgroundCalculation
    )
  })
}

/**
 * TODO
 * @param {*} conditionsValues
 * @returns
 */
export const reduceConditions = conditionsValues =>
  reduce(
    conditionsValues,
    (result, value) => {
      return comparingBooleanOr(result, value)
    },
    false,
  )

/**
 * Round number
 * @param {integer} value : value to round
 * @param {integer} step :round precision
 * @returns
 */
const round = (value, step) => {
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

/**
  * Return value from both booleans
        | True | False | Null
  ____________________________
  True  | True | True  | True
  ____________________________
  False | True | False | Null
  ____________________________
  Null  | True | Null  | Null
  *
  * @params [Boolean] firstBoolean [Boolean] secondBoolean
  * @return [Boolean]
  *
  */
export const comparingBooleanOr = (firstBoolean, secondBoolean) => {
  if (firstBoolean === true || secondBoolean === true) {
    return true
  }
  if (firstBoolean === false && secondBoolean === false) {
    return false
  }
  if (firstBoolean === null || secondBoolean === null) {
    return null
  }
}

/**
 * Set is the most effective way : https://stackoverflow.com/questions/26097132/javascript-remove-duplicates-algorithm-efficiency
 */
export const uniq = array => {
  return [...new Set(array)]
}
