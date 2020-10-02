import reduce from 'lodash/reduce';
import { store } from '../store';

/**
 * Main entry to get the condition boolean for a entity
 *
 * @param {(Instance | QuestionsSequence | FinalDiagnostic | QuestionsSequenceScore)} node
 * @return {boolean}
 *
 */
export const calculateCondition = (algorithm, node, medicalCase = store.getState()) => {
  const { nodes } = medicalCase;

  let isExcludedByComplaintCategory = false;
  // We check that all the complaint categories linked to the node are set to true
  switch (typeof node.cc) {
    case 'number':
      isExcludedByComplaintCategory = nodes[node.cc].booleanValue(algorithm) === false;
      break;
    case 'object':
      isExcludedByComplaintCategory = node.cc.some((complaintCategory) => {
        return nodes[complaintCategory].booleanValue(algorithm) === false;
      });
      break;
  }

  // If this is a top parent node
  if (node.top_conditions.length === 0 && !isExcludedByComplaintCategory) {
    return true;
  }

  // Loop for top_conditions
  const conditionsArrayBoolean = returnConditionsArray(node, medicalCase);
  return reduceConditionArrayBoolean(conditionsArrayBoolean) && !isExcludedByComplaintCategory;
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
  const { first_id, first_node_id, operator, second_node_id, second_id } = condition;

  const first_sub_condition = checkOneCondition(first_id, first_node_id, medicalCase);

  if (operator === null) {
    return first_sub_condition;
  }

  // Not used so far
  // const second_sub_condition = checkOneCondition(child, second_id, second_node_id, medicalCase);
  //
  // if (operator === 'AND') {
  //   return first_sub_condition && second_sub_condition;
  // }
  // if (operator === 'OR') {
  //   return comparingBooleanOr(first_sub_condition, second_sub_condition);
  // }

  return null;
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
