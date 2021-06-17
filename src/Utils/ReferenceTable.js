/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'

/**
 * Calculate reference score.
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null}
 */
export const calculateReference = (nodeId, newNodes) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const genderQuestionId =
    state.algorithm.item.config.basic_questions.gender_question_id

  let reference = null
  let value = null
  const currentNode = nodes[nodeId]

  // Get X and Y
  const mcQuestionX = newNodes[currentNode.reference_table_x_id]
  const mcQuestionY = newNodes[currentNode.reference_table_y_id]

  const currentQuestionX = nodes[mcQuestionX.id]
  const currentQuestionY = nodes[mcQuestionY.id]

  // Get Z
  let mcQuestionZ = null
  let currentQuestionZ = null
  if (currentNode.reference_table_z_id !== null) {
    mcQuestionZ = newNodes[currentNode.reference_table_z_id]
    currentQuestionZ = nodes[mcQuestionZ.id]
  }

  // Parse value in correct format
  const x =
    currentQuestionX.value_format === Config.VALUE_FORMATS.int
      ? parseInt(mcQuestionX.value)
      : currentQuestionX.round !== undefined
      ? mcQuestionX.roundedValue
      : parseFloat(mcQuestionX.value)
  const y =
    currentQuestionY.value_format === Config.VALUE_FORMATS.int
      ? parseInt(mcQuestionY.value)
      : currentQuestionY.round !== undefined
      ? mcQuestionY.roundedValue
      : parseFloat(mcQuestionY.value)
  let z

  if (mcQuestionZ !== null) {
    z =
      currentQuestionZ.value_format === Config.VALUE_FORMATS.int
        ? parseInt(mcQuestionZ.value)
        : currentQuestionZ.round !== undefined
        ? mcQuestionZ.roundedValue
        : parseFloat(mcQuestionZ.value)
  }

  const mcGenderQuestion = newNodes[genderQuestionId]
  const genderQuestion = nodes[genderQuestionId]
  const gender =
    mcGenderQuestion.answer !== null
      ? genderQuestion.answers[mcGenderQuestion.answer].value
      : null

  // Get reference table for male or female
  if (gender === 'male') {
    reference = Config.REFERENCES[currentNode.reference_table_male]
  } else if (gender === 'female') {
    reference = Config.REFERENCES[currentNode.reference_table_female]
  }
  // If X and Y means question is not answered + check if answer is in the scope of the reference table
  if (reference !== null && x !== null && y !== null && z === undefined) {
    value = processReferenceTable(reference, x, y)
  } else if (reference !== null && x !== null && y !== null && z !== null) {
    value = processReferenceTable3D(reference, x, y, z)
  }

  return value
}

/**
 * Find value for a 3D reference table
 * @param referenceTable - Reference table available in frontend_service/api/...
 * @param referenceX - X value to not exceed
 * @param referenceY - Y value to not exceed
 * @param referenceZ - Z value to not exceed
 * @returns {null|*}
 */
const processReferenceTable3D = (
  referenceTable,
  referenceX,
  referenceY,
  referenceZ,
) => {
  let value = null

  // If X exist in reference table
  if (referenceX in referenceTable) {
    value = processReferenceTable(
      referenceTable[referenceX],
      referenceY,
      referenceZ,
    )
  } else {
    const scopedRange = Object.keys(referenceTable).sort((a, b) => a - b)

    if (scopedRange[0] > referenceX) {
      value = processReferenceTable(
        referenceTable[scopedRange[0]],
        referenceY,
        referenceZ,
      )
    } else {
      value = processReferenceTable(
        referenceTable[scopedRange[scopedRange.length - 1]],
        referenceY,
        referenceZ,
      )
    }
  }
  return value
}

/**
 * Find value for a 2D reference table
 * @param referenceTable - Reference table available in frontend_service/api/...
 * @param referenceX - Z value to not exceed
 * @param referenceY - Y value to not exceed
 * @returns {null|*}
 */
const processReferenceTable = (referenceTable, referenceX, referenceY) => {
  let value = null

  // If X exist in reference table
  if (referenceX in referenceTable) {
    value = findValueInReferenceTable(referenceTable[referenceX], referenceY)
  } else {
    const scopedRange = Object.keys(referenceTable).sort((a, b) => a - b)

    if (scopedRange[0] > referenceX) {
      value = findValueInReferenceTable(
        referenceTable[scopedRange[0]],
        referenceY,
      )
    } else {
      value = findValueInReferenceTable(
        referenceTable[scopedRange[scopedRange.length - 1]],
        referenceY,
      )
    }
  }
  return value
}

/**
 * Find value in a given reference table
 * @param referenceTable
 * @param reference
 * @returns {null|*}
 */
const findValueInReferenceTable = (referenceTable, reference) => {
  let previousKey = null
  let value = null

  const scopedRange = Object.keys(referenceTable).sort((a, b) => a - b)

  // If reference is smaller than the smallest value
  if (reference < referenceTable[scopedRange[0]]) {
    return scopedRange[0]
  }

  // If reference is bigger than the best value
  if (reference > referenceTable[scopedRange[scopedRange.length - 1]]) {
    return scopedRange[scopedRange.length - 1]
  }

  scopedRange.some(key => {
    if (referenceTable[key] === reference) {
      value = Number(key)
      return true
    }

    if (referenceTable[key] > reference) {
      value = parseInt(key) <= 0 ? Number(key) : Number(previousKey)
      return true
    }

    previousKey = key
  })
  return value
}
