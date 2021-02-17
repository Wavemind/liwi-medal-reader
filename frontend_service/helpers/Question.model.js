// @flow

import moment from 'moment';
import { valueFormats, references } from '../constants';
import I18n from '../../src/utils/i18n';

/**
 * Calculate condition to display triage question
 * @param medicalCase
 * @param mcNode
 * @returns {boolean}
 */
export const questionIsDisplayedInTriage = (medicalCase, mcNode) => {
  const { conditions } = medicalCase.triage;
  let isDisplayed = true;

  // Skip if there is no conditions
  if (conditions?.[mcNode.id] !== undefined) {
    isDisplayed = false;
    conditions[mcNode.id].forEach((condition) => {
      if (medicalCase.nodes[condition.complaint_category_id].answer === condition.answer_id) {
        isDisplayed = true;
      }
    });
  }

  return isDisplayed;
};

/**
 * Parse the formula and calculate it if all nodes needed is answered
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null|any}
 */
export const questionCalculateFormula = (algorithm, medicalCase, mcNode) => {
  // Regex to find the brackets [] in the formula
  const findBracketId = /\[(.*?)\]/gi;
  const currentNode = algorithm.nodes[mcNode.id];
  let ready = true;

  // Function to change the [id] into the answered value
  const replaceBracketToValue = (item) => {
    // Get the id from the brackets []
    const id = item.match(/\d/g).join('');

    // Get value of node
    const mcNodeInBracket = medicalCase.nodes[id];
    const currentNodeInBracket = algorithm.nodes[id];

    if (mcNodeInBracket.value === null || (mcNodeInBracket.value === 0 && mcNodeInBracket.answer === null)) {
      ready = false;
      return item;
    }

    switch (currentNodeInBracket.value_format) {
      case valueFormats.date:
        return moment().diff(moment(mcNodeInBracket.value).toDate(), item.search('ToMonth') > 0 ? 'months' : 'days');
      default:
        return mcNodeInBracket.value;
    }
  };
  // Replace every bracket in the formula with it's value
  const formula = currentNode.formula.replace(findBracketId, replaceBracketToValue);

  if (ready) {
    return eval(formula);
  }

  return null;
};

/**
 * Calculate reference score.
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null}
 */
export const questionCalculateReference = (algorithm, medicalCase, mcNode) => {
  let reference = null;
  let value = null;
  const currentNode = algorithm.nodes[mcNode.id];

  // Get X and Y
  const mcQuestionX = medicalCase.nodes[currentNode.reference_table_x_id];
  const mcQuestionY = medicalCase.nodes[currentNode.reference_table_y_id];

  // Get Z
  let mcQuestionZ = null;
  if (currentNode.reference_table_z_id !== null) {
    mcQuestionZ = medicalCase.nodes[currentNode.reference_table_z_id];
  }

  // Parse value in correct format
  const x = algorithm.nodes[mcQuestionX.id].value_format === valueFormats.int ? parseInt(mcQuestionX.value) : parseFloat(mcQuestionX.value);
  const y = algorithm.nodes[mcQuestionY.id].value_format === valueFormats.int ? parseInt(mcQuestionY.value) : parseFloat(mcQuestionY.value);
  let z;

  if (mcQuestionZ !== null) {
    z = algorithm.nodes[mcQuestionZ.id].value_format === valueFormats.int ? parseInt(mcQuestionZ.value) : parseFloat(mcQuestionZ.value);
  }

  const mcGenderQuestion = medicalCase.nodes[algorithm.config.basic_questions.gender_question_id];
  const genderQuestion = algorithm.nodes[algorithm.config.basic_questions.gender_question_id];
  const gender = mcGenderQuestion.answer !== null ? genderQuestion.answers[mcGenderQuestion.answer].value : null;

  // Get reference table for male or female
  if (gender === 'male') {
    reference = references[currentNode.reference_table_male];
  } else if (gender === 'female') {
    reference = references[currentNode.reference_table_female];
  }

  // If X and Y means question is not answered + check if answer is in the scope of the reference table
  if (reference !== null && x !== null && y !== null && z === undefined) {
    value = processReferenceTable(reference, x, y);
  } else if (reference !== null && x !== null && y !== null && z !== null) {
    value = processReferenceTable3D(reference, x, y, z);
  }

  return value;
};

/**
 * Find value for a 3D reference table
 * @param referenceTable - Reference table available in frontend_service/api/...
 * @param referenceX - X value to not exceed
 * @param referenceY - Y value to not exceed
 * @param referenceZ - Z value to not exceed
 * @returns {null|*}
 */
const processReferenceTable3D = (referenceTable, referenceX, referenceY, referenceZ) => {
  let value = null;

  // If X exist in reference table
  if (referenceX in referenceTable) {
    value = processReferenceTable(referenceTable[referenceX], referenceY, referenceZ);
  } else {
    const scopedRange = Object.keys(referenceTable).sortByNumber();

    if (scopedRange.first() > referenceX) {
      value = processReferenceTable(referenceTable[scopedRange.first()], referenceY, referenceZ);
    } else {
      value = processReferenceTable(referenceTable[scopedRange.last()], referenceY, referenceZ);
    }
  }
  return value;
};

/**
 * Find value for a 2D reference table
 * @param referenceTable - Reference table available in frontend_service/api/...
 * @param referenceX - Z value to not exceed
 * @param referenceY - Y value to not exceed
 * @returns {null|*}
 */
const processReferenceTable = (referenceTable, referenceX, referenceY) => {
  let value = null;

  // If X exist in reference table
  if (referenceX in referenceTable) {
    value = findValueInReferenceTable(referenceTable[referenceX], referenceY);
  } else {
    const scopedRange = Object.keys(referenceTable).sortByNumber();

    if (scopedRange.first() > referenceX) {
      value = findValueInReferenceTable(referenceTable[scopedRange.first()], referenceY);
    } else {
      value = findValueInReferenceTable(referenceTable[scopedRange.last()], referenceY);
    }
  }
  return value;
};

/**
 * Find value in a given reference table
 * @param referenceTable
 * @param reference
 * @returns {null|*}
 */
const findValueInReferenceTable = (referenceTable, reference) => {
  let previousKey = null;
  let value = null;

  const scopedRange = Object.keys(referenceTable).sortByNumber();

  // If reference is smaller than the smallest value
  if (reference < referenceTable[scopedRange.first()]) {
    return scopedRange.first();
  }

  // If reference is bigger than the best value
  if (reference > referenceTable[scopedRange.last()]) {
    return scopedRange.last();
  }

  scopedRange.map((key) => {
    if (referenceTable[key] === reference) {
      value = Number(key);
      return true;
    }

    if (referenceTable[key] > reference) {
      value = Number(previousKey);
      return true;
    }
    previousKey = key;
  });

  return value;
};

/**
 * Return a humanized value who depend on value_format
 * @param algorithm
 * @param mcNode
 * @returns {string|*}
 */
export const questionDisplayValue = (algorithm, mcNode) => {
  const currentNode = algorithm.nodes[mcNode.id];
  if (currentNode.value_format === valueFormats.date && mcNode.value !== null) {
    return moment(mcNode.value).format(I18n.t('application:date_format'));
  }
  return mcNode.value === null ? '' : mcNode.value;
};

/**
 * Returns the value for a boolean question or a complaint category
 * @param algorithm
 * @param mcNode
 * @returns {boolean}
 */
export const questionBooleanValue = (algorithm, mcNode) => {
  if (mcNode !== undefined) {
    const { answers } = algorithm.nodes[mcNode.id];
    return mcNode.answer === Number(Object.keys(answers).first());
  }
};
