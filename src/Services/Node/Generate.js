import { Config } from '@/Config'
/**
 * Generate new question hash used in medical case
 * @param node
 * @returns {{dd: [], df: [], qs: [], system: *, answer: null, validationMessage: null, validationType: null, id: *, counter: number, type: *, category: *, value: string}}
 */
export const generateQuestion = node => {
  const {
    answer = null,
    //dd = [],
    //df = [],
    //qs = [],
    value = '',
    roundedValue = '',
    estimable = false,
    estimableValue = 'measured',
    validationMessage = null,
    validationType = null,
    unavailableValue = false,
  } = node

  const hash = {
    ..._generateCommon(node),
    answer,
    //dd,
    //df,
    //qs,
    value,
    roundedValue,
    validationMessage,
    validationType,
    unavailableValue,
  }

  // Add attribute for basic measurement question ex (weight, MUAC, height) to know if it's measured or estimated value answered
  if (estimable) {
    // Type available [measured, estimated]
    hash.estimableValue = estimableValue
  }

  return hash
}

/**
 * Generate new question sequences and question sequences scored hash used in medical case
 * @param node
 * @returns {{dd: [], df: [], qs: [], answer: null, id: *, type: *, category: *}}
 */
export const generateQuestionsSequence = node => {
  const { answer = null, dd = [], qs = [], df = [] } = node
  return {
    ..._generateCommon(node),
    answer,
    dd,
    df,
    qs,
  }
}

/**
 * Generate new management hash used in medical case
 * @param node
 * @returns {{id: *, type: *, category: *, healthCareObject: string}}
 */
export const generateManagement = node => {
  return {
    ..._generateCommon(node),
  }
}

/**
 * Generate new drug hash used in medical case
 * @param node
 * @returns {{id: *, type: *, category: *, healthCareObject: string}}
 */
export const generateDrug = node => {
  const { formulationSelected = null } = node

  return {
    ..._generateCommon(node),
    formulationSelected,
    healthCareObject: 'drugs',
  }
}

/**
 * Generate new final diagnostic hash used in medical case
 * @param node
 * @returns {{id: *, type: *, category: *, healthCareObject: string}}
 */
export const generateFinalDiagnostic = node => {
  return {
    ..._generateCommon(node),
  }
}

/**
 * Generate common values available in all medical case node's
 * @param node
 * @returns {{id: *, type: *, category: *}}
 * @private
 */
const _generateCommon = node => {
  const { id } = node
  return { id }
}

export default ({ nodes }) => {
  const newNodes = {}
  Object.values(nodes).forEach(node => {
    switch (node.type) {
      case Config.NODE_TYPES.questionsSequence:
        newNodes[node.id] = generateQuestionsSequence(node)
        break
      case Config.NODE_TYPES.question:
        newNodes[node.id] = generateQuestion(node)
        break
      case Config.NODE_TYPES.healthCare:
      case Config.NODE_TYPES.finalDiagnostic:
        newNodes[node.id] = generateFinalDiagnostic(node)
        break
      default:
        if (node.category === Config.CATEGORIES.management) {
          newNodes[node.id] = generateManagement(node)
        } else if (node.category === Config.CATEGORIES.drug) {
          newNodes[node.id] = generateDrug(node)
        } else {
          newNodes[node.id] = node.id
        }
    }
  })
  return newNodes
}
