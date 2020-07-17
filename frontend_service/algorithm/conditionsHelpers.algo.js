import reduce from 'lodash/reduce';
import { store } from '../store';

/**
 * Main entry to get the condition boolean for a entity
 *
 * @param {(Instance | QuestionsSequence | FinalDiagnostic | QuestionsSequenceScore)} node
 * @return {boolean}
 *
 */
export const calculateCondition = (node) => {
  const state$ = store.getState();
  const { nodes } = state$;

  let isExcludedByComplaintCategory = false;

  if (node.cc !== undefined) {
    isExcludedByComplaintCategory = node.cc.some((complaintCategory) => {
      return nodes[complaintCategory].booleanValue() === false;
    });
  }

  // If this is a top parent node
  if (node.top_conditions.length === 0 && !isExcludedByComplaintCategory) {
    return true;
  }

  // Loop for top_conditions
  const conditionsArrayBoolean = returnConditionsArray(node);

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
export const returnConditionsArray = (node) => node.top_conditions.map((conditions) => comparingTopConditions(node, conditions));

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
const checkOneCondition = (child, wantedId, nodeId) => {
  const state$ = store.getState();

  if (state$.nodes[nodeId].answer !== null) {
    // Console.warn should only appear if there is a format error in ids
    if (Number(state$.nodes[nodeId].answer) !== state$.nodes[nodeId].answer || Number(wantedId) !== wantedId) {
      console.warn(
        '%c --- DANGER STRING OR NUMBER PROBLEM TYPE --- ',
        'background: #FF0000; color: #F6F3ED; padding: 5px',
        child,
        wantedId,
        nodeId,
        state$.nodes[nodeId].answer,
        typeof nodeId,
        typeof state$.nodes[nodeId].answer
      );
    }
    return Number(state$.nodes[nodeId].answer) === Number(wantedId);
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
export const comparingTopConditions = (child, condition) => {
  const { first_id, first_node_id, first_type, operator, second_node_id, second_id, second_type } = condition;
  let second_sub_condition;
  let first_sub_condition;

  first_sub_condition = checkOneCondition(child, first_id, first_node_id, first_type);

  if (operator === null) {
    return first_sub_condition;
  }
  second_sub_condition = checkOneCondition(child, second_id, second_node_id, second_type);

  if (operator === 'AND') {
    return first_sub_condition && second_sub_condition;
  }
  if (operator === 'OR') {
    return comparingBooleanOr(first_sub_condition, second_sub_condition);
  }

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
const comparingBooleanOr = (firstBoolean, secondBoolean) => {
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
