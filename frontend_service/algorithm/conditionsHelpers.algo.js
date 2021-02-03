import reduce from 'lodash/reduce';
import { store } from '../store';

/**
 * Main entry to get the condition boolean for a entity
 * @param algorithm
 * @param node
 * @param medicalCase
 * @returns {boolean}
 */
export const calculateCondition = (algorithm, node, medicalCase = store.getState()) => {
  if (node.top_conditions.length === 0) {
    return true;
  }
  // Loop for top_conditions
  const conditionsArrayBoolean = returnConditionsArray(node, medicalCase);
  return reduceConditionArrayBoolean(conditionsArrayBoolean);
};

/**
 * Loop over top_conditions
 * Return a array containing multiple boolean
 *
 * @param node
 * @return {array}
 *
 */
export const returnConditionsArray = (node, medicalCase) => node.top_conditions.map((conditions) => comparingTopConditions(conditions, medicalCase));
/**
 * Get a array of boolean and return the final boolean between null | true | false
 *
 * @param {array} conditionsArrayBoolean
 * @return {boolean}
 *
 */

export const reduceConditionArrayBoolean = (conditionsArrayBoolean) =>
  reduce(
    conditionsArrayBoolean,
    (result, value) => {
      return comparingBooleanOr(result, value);
    },
    false
  );

/**
 * Does this node has the right answer ?
 * If not answered return null
 *
 * @param child
 * @param {number} wantedId
 * @param {number} nodeId
 * @param {string} conditionType
 * @returns {null|boolean}
 *
 */
const checkOneCondition = (wantedId, nodeId, medicalCase = store.getState()) => {
  if (medicalCase.nodes[nodeId].answer !== null) {
    return Number(medicalCase.nodes[nodeId].answer) === Number(wantedId);
  }
  return null;
};

/**
 * Check a complete condition by operator
 * @param {(Instance | QuestionsSequence | FinalDiagnostic | QuestionsSequenceScore)} child
 * @param {top_condition} conditions
 * @returns {null || false || true}
 *
 */
export const comparingTopConditions = (condition, medicalCase) => {
  const { first_id, first_node_id } = condition;
  return checkOneCondition(first_id, first_node_id, medicalCase);

};

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
    return true;
  }
  if (firstBoolean === false && secondBoolean === false) {
    return false;
  }
  if (firstBoolean === null || secondBoolean === null) {
    return null;
  }
};
