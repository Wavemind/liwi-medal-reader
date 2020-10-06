// @flow

import moment from 'moment';
import { valueFormats, references } from '../constants';
import I18n from '../../src/utils/i18n';

/**
 * Calculate condition to display triage question
 * @params medicalCase : object
 * @return isDisplayed : boolean
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
 * Parse the formula and calculate it if possible
 *
 * @param node
 * @returns {number}
 *
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
 * @returns refer to reference tables
 */
export const questionCalculateReference = (algorithm, medicalCase, mcNode) => {
  let reference = null;
  let value = null;
  const currentNode = algorithm.nodes[mcNode.id];

  // Get X and Y
  const mcQuestionX = medicalCase.nodes[currentNode.reference_table_x_id];
  const mcQuestionY = medicalCase.nodes[currentNode.reference_table_y_id];

  // Get Z
  let questionZ = null;
  if (this.reference_table_z_id !== null) {
    questionZ = medicalCase.nodes[currentNode.reference_table_z_id];
  }

  const x = parseInt(mcQuestionX.value);
  const y = parseInt(mcQuestionY.value);
  const z = questionZ?.value;

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
  // TODO: Fixe Z issue when it's null
  if (reference !== null && x !== null && y !== null && x in reference) {
    if (z === undefined) {
      value = findValueInReferenceTable(reference[x], y);
    } else if (String(y) in reference[x]) {
      value = findValueInReferenceTable(reference[x][y], z);
    }
  }

  return value;
};

/**
 *
 * @param {JSON} referenceTable - Reference table available in frontend_service/api/...
 * @param {Integer} maxRange - Y or Z value to not exceed
 * @returns {null|Integer} - Value find
 */
// TODO comment
const findValueInReferenceTable = (referenceTable, maxRange) => {
  let previousKey = null;
  let value = null;

  // Order the keys
  const scopedRange = Object.keys(referenceTable).sortByNumber();

  // if value smaller than smallest element return the smaller value
  if (referenceTable[scopedRange.first()] > maxRange) {
    return scopedRange.first();
  }
  if (referenceTable[scopedRange.last()] < maxRange) {
    return scopedRange.last();
  }

  scopedRange.map((key) => {
    if (referenceTable[key] > maxRange) {
      value = Number(previousKey);
      return true;
    }
    previousKey = key;
  });

  return value;
};

/**
 * Return a humanized value who depend on value_format
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
 * Returns the value for a boolean question  or a complaint category
 */
export const questionBooleanValue = (algorithm, mcNode) => {
  const { answers } = algorithm.nodes[mcNode.id];
  return mcNode.answer === Number(Object.keys(answers).first());
};
