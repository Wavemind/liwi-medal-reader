/**
 * The external imports
 */
import reduce from 'lodash/reduce'
import findKey from 'lodash/findKey'
import differenceInDays from 'date-fns/differenceInDays'

/**
 * The internal imports
 */
import { getYesAnswer } from '@/Utils/Answers'
import { store } from '@/Store'
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'

/**
 * Will go through all the diagnoses of the algorithm and will return those that are still
 * valid based on the selected complain categories and the birth date(cut off)
 * @returns {Array<Diagnoses>} : List of valid diagnoses
 */
export const getValidDiagnoses = () => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes
  const diagnoses = state.algorithm.item.diagnoses

  return Object.values(diagnoses).filter(diagnosis => {
    return (
      mcNodes[diagnosis.complaint_category].answer ===
        getYesAnswer(nodes[diagnosis.complaint_category]).id &&
      respectsCutOff(diagnosis.cut_off_start, diagnosis.cut_off_end)
    )
  })
}

/**
 * Tells if a cut off is respected based on patients birth date and the medical case creation date
 * @param { Timestamp | null } cut_off_start : Lower threshold
 * @param { Timestamp | null } cut_off_end : Higher threshold
 * @returns { Boolean }
 */
export const respectsCutOff = (cut_off_start, cut_off_end) => {
  const state = store.getState()
  const birthDate = state.patient.item.birth_date
  const createdAt = state.medicalCase.item.createdAt

  const ageInDays = differenceInDays(new Date(createdAt), new Date(birthDate))
  if (cut_off_start === null && cut_off_end === null) {
    return true
  }
  if (cut_off_start === null) {
    return cut_off_end > ageInDays
  }
  if (cut_off_end === null) {
    return cut_off_start < ageInDays
  } else {
    return cut_off_start < ageInDays && cut_off_end > ageInDays
  }
}

/**
 * Returns the nodes without condition of a diagnosis or a question sequence
 * @param {Array<Instance>} instances : instances from the diagram we are handling
 * @returns {Array<Instance>} Instances without conditions
 */
export const getTopConditions = instances => {
  return Object.values(instances).filter(
    instance =>
      instance.conditions.length === 0 && instance.final_diagnosis_id === null,
  )
}
/**
 * Transforms an array of system to an object that is readable by the view and will order it
 * based on the order defined in the algorithm
 * @param {} systemOrder : Order of the systems and the question for this specific step
 * @param {} questionsPerSystem : the systems and the question before ordering
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
 * @param {*} questionsToDisplay
 * @param {*} instances
 * @param {*} categories
 */
export const handleChildren = (
  children,
  questionsToDisplay,
  instances,
  categories,
  diagramId,
  diagramType = Config.NODE_TYPES.diagnosis,
  system = true,
) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes

  children.forEach(instance => {
    if (instance.conditions.length === 0 || calculateCondition(instance)) {
      if (nodes[instance.id].type === Config.NODE_TYPES.questionsSequence) {
        const topConditions = getTopConditions(nodes[instance.id].instances)
        handleChildren(
          topConditions,
          questionsToDisplay,
          nodes[instance.id].instances,
          categories,
          instance.id,
          Config.NODE_TYPES.questionsSequence,
          system,
        )
      } else {
        if (system) {
          addQuestionToSystem(instance.id, questionsToDisplay, categories)
        } else {
          addQuestion(instance.id, questionsToDisplay, categories)
        }
      }
      // console.log(instance.children, diagramType, diagramId)
      const childrenInstance = instance.children
        .filter(
          childId =>
            (nodes[childId].type !== Config.NODE_TYPES.finalDiagnosis &&
              diagramType === Config.NODE_TYPES.diagnosis) ||
            (diagramType === Config.NODE_TYPES.questionsSequence &&
              childId !== diagramId),
        )
        .map(childId => instances[childId])
      if (childrenInstance.length > 0) {
        handleChildren(
          childrenInstance,
          questionsToDisplay,
          instances,
          categories,
          diagramId,
          diagramType,
          system,
        )
      }
    }
  })
}

/**
 * TODO
 * @param {*} questionId
 * @param {*} questionsToDisplay
 * @param {*} categories
 */
export const addQuestionToSystem = (
  questionId,
  questionsToDisplay,
  categories,
) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  if (categories.includes(nodes[questionId].category)) {
    if (nodes[questionId].system in questionsToDisplay) {
      questionsToDisplay[nodes[questionId].system].push(questionId)
    } else {
      questionsToDisplay[nodes[questionId].system] = [questionId]
    }
  }
}
export const addQuestion = (questionId, questionsToDisplay, categories) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  if (categories.includes(nodes[questionId].category)) {
    questionsToDisplay.push(questionId)
  }
}

export const excludedByCC = questionId => {
  const state = store.getState()
  const mcNodes = state.medicalCase.item.nodes
  const nodes = state.algorithm.item.nodes

  return nodes[questionId].conditioned_by_cc.some(
    ccId => mcNodes[ccId].answer === getYesAnswer(nodes[ccId]).id,
  )
}

/**
 * TODO
 * @param {*} instance
 * @returns
 */
export const calculateCondition = instance => {
  const state = store.getState()
  const mcNodes = state.medicalCase.item.nodes

  if (excludedByCC(instance.id)) {
    return false
  }
  if (instance.conditions.length === 0) {
    return true
  }
  return instance.conditions.some(condition => {
    return mcNodes[condition.node_id].answer === condition.answer_id
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
export const handleAnswerId = (node, value) => {
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
export const setNodeValue = (mcNode, node, value) => {
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

export const debugNode = (nodeId, mcNodes) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const result = nodes[nodeId].dd.map(diagnosisId => {
    return {
      [diagnosisId.id]: debugNodeInDiagnosis(diagnosisId.id, nodeId, mcNodes),
    }
  })
  console.info(nodeId, translate(nodes[nodeId].label), result)
}
const debugNodeInDiagnosis = (diagnosisId, nodeId, mcNodes) => {
  const validDiagnosesIds = getValidDiagnoses().map(diagnosis => diagnosis.id)
  const state = store.getState()
  const diagnoses = state.algorithm.item.diagnoses

  if (!validDiagnosesIds.includes(diagnosisId)) {
    return false
  }
  if (excludedByCC(nodeId)) {
    return false
  }
  if (diagnoses[diagnosisId].instances[nodeId].conditions.length === 0) {
    return true
  }
  return debugCalculateCondition(
    diagnosisId,
    diagnoses[diagnosisId].instances[nodeId].conditions,
    mcNodes,
  )
}
const debugCalculateCondition = (diagnosisId, conditions, mcNodes) => {
  const state = store.getState()
  const diagnoses = state.algorithm.item.diagnoses

  if (conditions.length === 0) {
    return true
  }

  return conditions.some(condition => {
    const conditionValue =
      mcNodes[condition.node_id].answer === condition.answer_id
    if (conditionValue) {
      return debugCalculateCondition(
        diagnosisId,
        diagnoses[diagnosisId].instances[condition.node_id].conditions,
        mcNodes,
      )
    } else {
      return false
    }
  })
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
