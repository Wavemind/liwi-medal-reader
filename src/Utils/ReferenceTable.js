/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import i18n from '@/Translations/index'

/**
 * Parse value returned by reference table and make it readable
 * @param value
 * @param nodeId
 * @param mcNode
 * @return string readable value
 */
export const displayResult = (value, nodeId) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes
  const currentNode = nodes[nodeId]

  // Get reference table for male or female
  const reference = getReferenceTable(currentNode, mcNodes)

  if (currentNode.reference_table_z_id === null) {
    switch (value) {
      case 5:
        return i18n.t('reference_table.more', { number: 5 })
      case 4:
        if (5 in Object.values(reference)[0]) {
          return i18n.t('reference_table.between', {
            number_1: 4,
            number_2: 5,
          })
        } else {
          return i18n.t('reference_table.more', { number: 4 })
        }
      case 3:
        if (4 in Object.values(reference)[0]) {
          return i18n.t('reference_table.between', {
            number_1: 3,
            number_2: 4,
          })
        } else {
          return i18n.t('reference_table.more', { number: 3 })
        }
      case 2:
        return i18n.t('reference_table.between', {
          number_1: 2,
          number_2: 3,
        })
      case 1:
        return i18n.t('reference_table.between', {
          number_1: 1,
          number_2: 2,
        })
      case 0:
        return i18n.t('reference_table.between', {
          number_1: -1,
          number_2: 1,
        })
      case -5:
        return i18n.t('reference_table.less', { number: -5 })
      case -4:
        if (-5 in Object.values(reference)[0]) {
          return i18n.t('reference_table.between', {
            number_1: -5,
            number_2: -4,
          })
        } else {
          return i18n.t('reference_table.less', { number: -4 })
        }
      case -3:
        if (-4 in Object.values(reference)[0]) {
          return i18n.t('reference_table.between', {
            number_1: -4,
            number_2: -3,
          })
        } else {
          return i18n.t('reference_table.less', { number: -3 })
        }
      case -2:
        return i18n.t('reference_table.between', { number_1: -3, number_2: -2 })
      case -1:
        return i18n.t('reference_table.between', { number_1: -2, number_2: -1 })
    }
  }

  return ''
}

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
  if (mcQuestionX.value !== '' && mcQuestionY.value !== '') {
    let x = null
    if (currentQuestionX.value_format === Config.VALUE_FORMATS.int) {
      x = parseInt(mcQuestionX.value, 10)
    } else {
      if (currentQuestionX.round !== undefined) {
        x = mcQuestionX.roundedValue
      } else {
        x = parseFloat(mcQuestionX.value)
      }
    }

    let y = null
    if (currentQuestionY.value_format === Config.VALUE_FORMATS.int) {
      y = parseInt(mcQuestionY.value, 10)
    } else {
      if (currentQuestionY.round !== undefined) {
        y = mcQuestionY.roundedValue
      } else {
        y = parseFloat(mcQuestionY.value)
      }
    }

    let z
    if (mcQuestionZ !== null) {
      if (currentQuestionZ.value_format === Config.VALUE_FORMATS.int) {
        z = parseInt(mcQuestionZ.value, 10)
      } else {
        if (currentQuestionZ.round !== undefined) {
          z = mcQuestionZ.roundedValue
        } else {
          z = parseFloat(mcQuestionZ.value)
        }
      }
    }

    const reference = getReferenceTable(currentNode, newNodes)

    // If X and Y means question is not answered + check if answer is in the scope of the reference table
    if (reference !== null && z === undefined) {
      value = processReferenceTable(reference, x, y)
    } else if (reference !== null && z !== null) {
      value = processReferenceTable3D(reference, x, y, z)
    }
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
 * @param referenceX - X value to not exceed
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

  // Please refer to issue https://github.com/Wavemind/liwi-medal-reader/issues/491 for new z-score rules
  const scopedRange = Object.keys(referenceTable).sort((a, b) => a - b)

  // If reference is the same value of the latest value, give higher key
  if (reference === referenceTable[scopedRange[0]]) {
    return parseInt(scopedRange[1])
  }

  // If reference is the same value of the highest value, give lower key
  if (reference === referenceTable[scopedRange[scopedRange.length - 1]]) {
    return parseInt(scopedRange[scopedRange.length - 2])
  }

  // If reference is smaller than the smallest value
  if (reference < referenceTable[scopedRange[0]]) {
    return parseInt(scopedRange[0])
  }

  // If reference is bigger than the best value
  if (reference > referenceTable[scopedRange[scopedRange.length - 1]]) {
    return parseInt(scopedRange[scopedRange.length - 1])
  }

  scopedRange.some(key => {
    if (referenceTable[key] === reference) {
      const currentIndex = scopedRange.indexOf(key)

      if (Number(key) === 0) {
        value = Number(scopedRange[currentIndex])
        return true
      }

      value =
        parseInt(key) < 0
          ? Number(scopedRange[currentIndex + 1])
          : Number(scopedRange[currentIndex - 1])
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

/**
 * Return a reference table based on patient gender
 * @param {*} currentNode
 * @param {*} mcNodes
 * @returns hash
 */
const getReferenceTable = (currentNode, mcNodes) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const genderQuestionId =
    state.algorithm.item.config.basic_questions.gender_question_id

  const mcGenderQuestion = mcNodes[genderQuestionId]
  const genderQuestion = nodes[genderQuestionId]
  const gender =
    mcGenderQuestion.answer !== null
      ? genderQuestion.answers[mcGenderQuestion.answer].value
      : null

  // Get reference table for male or female
  if (gender === 'male') {
    return Config.REFERENCES[currentNode.reference_table_male]
  } else if (gender === 'female') {
    return Config.REFERENCES[currentNode.reference_table_female]
  }

  return null
}
