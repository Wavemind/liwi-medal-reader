// TODO: IN PROGRESS
import reduce from 'lodash/reduce';
import { store } from '../store';

/**
 *
 * @param {(Instance | QuestionsSequence | FinalDiagnostic | QuestionsSequenceScore)} node
 * @return {boolean}
 *
 * Main entry to get the condition boolean for a entity
 */
export const calculateCondition = (node) => {
  // If this is a top parent node
  if (node.top_conditions.length === 0) {
    return true;
  }

  // Loop for top_conditions
  let conditionsArrayBoolean = returnConditionsArray(node);

  return reduceConditionArrayBoolean(conditionsArrayBoolean);
};

/**
 *
 * @param node
 * @return {array}
 *
 * Loop over top_conditions
 * Return a array containing multiple bollean
 */
export const returnConditionsArray = (node) =>
  node.top_conditions.map((conditions) =>
    comparingTopConditions(node, conditions)
  );

/**
 *
 * @param {array} conditionsArrayBoolean
 * @return {boolean}
 *
 * Get a array of boolean and return the final boolean between null | true | false
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
 * @param node
 * @returns {number}
 *
 * Parse the formula and calculate it if possible
 */
export const calculateFormula = (node) => {
  const state$ = store.getState();

  // Regex to find []
  const findBrackertId = /\[(.*?)\]/gi;
  let ready = true;

  // Function to change the [id] into the good value
  const functionReplacing = (item) => {
    // Get the id into []
    let id = item.match(/\d/g).join('');

    // Get value of this node
    const nodeValue = state$.nodes[id].value;

    if (nodeValue === 0) {
      ready = false;
      return item;
    } else {
      return nodeValue;
    }
  };

  // Find in string each item with functionReplacing
  let replacer = node.formula.replace(findBrackertId, functionReplacing);

  if (ready) return eval(replacer);
};

/**
 *
 * @param child
 * @param {number} wantedId
 * @param {number} nodeId
 * @param {string} conditionType
 * @returns {null|boolean}
 *
 * Does this node has the right answer ?
 * If not answered return null
 */
const checkOneCondition = (child, wantedId, nodeId, conditionType) => {
  const state$ = store.getState();

  switch (conditionType) {
    case 'Answer':
      if (state$.nodes[nodeId].answer !== null) {
        //  Unless it's a priority.
        return state$.nodes[nodeId].answer === wantedId;
      }

      return null;

    case 'Condition':
      // TODO here check the id condition nested hooo....
      break;
  }
};

/**
 * @param {(Instance | QuestionsSequence | FinalDiagnostic | QuestionsSequenceScore)} child
 * @param {top_condition} conditions
 * @returns {null || false || true}
 *
 * Check a complete condition by operator
 */
export const comparingTopConditions = (child, conditions) => {
  const {
    first_id,
    first_node_id,
    first_type,
    operator,
    second_node_id,
    second_id,
    second_type,
  } = conditions;
  let second_sub_condition;
  let first_sub_condition;

  first_sub_condition = checkOneCondition(
    child,
    first_id,
    first_node_id,
    first_type
  );

  if (operator === null) {
    return first_sub_condition;
  } else {
    second_sub_condition = checkOneCondition(
      child,
      second_id,
      second_node_id,
      second_type
    );

    if (operator === 'AND') {
      return first_sub_condition && second_sub_condition;
    } else if (operator === 'OR') {
      return comparingBooleanOr(first_sub_condition, second_sub_condition);
    }
  }
  return null;
};

/**
*  @params [Boolean] firstBoolean [Boolean] secondBoolean
 * @return [Boolean]
 * Return value from both booleans
*
*       | True | False | Null
 ____________________________
 True  | True | True  | True
 ____________________________
 False | True | False | Null
 ____________________________
 Null  | True | Null  | Null
* */
const comparingBooleanOr = (firstBoolean, secondBoolean) => {
  if (firstBoolean === true || secondBoolean === true) {
    return true;
  } else if (firstBoolean === false && secondBoolean === false) {
    return false;
  } else if (firstBoolean === null || secondBoolean === null) {
    return null;
  }
};
