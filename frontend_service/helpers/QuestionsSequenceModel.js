// @flow
import filter from 'lodash/filter';
import find from 'lodash/find';

import { calculateCondition, comparingTopConditions } from '../algorithm/conditionsHelpers.algo';

import { categories } from '../constants';

/**
 * Calculate score and question sequence scored status
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null|boolean}
 * @private
 */
const _questionSequenceScoredCalculateCondition = (algorithm, medicalCase, mcNode) => {
  const currentNode = algorithm.nodes[mcNode.id];

  // If this is a top parent node
  if (currentNode.top_conditions.length === 0) {
    return true;
  }

  let scoreTrue = 0;
  let scoreFalse = 0;
  let scoreNull = 0;
  let scoreTotalPossible = 0;

  // Loop for top_conditions
  currentNode.top_conditions.map((conditions) => {
    const returnedBoolean = comparingTopConditions(conditions, medicalCase);

    scoreTotalPossible += conditions.score;
    switch (returnedBoolean) {
      case true:
        scoreTrue += conditions.score;
        break;
      case false:
        scoreFalse += conditions.score;
        break;
      case null:
        scoreNull += conditions.score;
        break;
    }

    return returnedBoolean;
  });

  // If score true so this QS is true
  if (scoreTrue >= currentNode.min_score) return true;
  // If there are more false condition than min necessary so we return false
  if (scoreTotalPossible - scoreFalse >= currentNode.min_score) return false;
  // If there are more null condition than min necessary so we return null
  if (scoreTotalPossible - scoreNull >= currentNode.min_score) return null;
};

const _questionSequenceCalculateCondition = (algorithm, medicalCase, mcNode) => {
  const currentNode = algorithm.nodes[mcNode.id];
  /**
   * Filter the top conditions
   *
   *  1. On Each top_condition
   *  2. Find the instance Id of the condition
   *  3. Check if the instance has the conditionValue to true
   *    If false the instance is closed (not answered or wrong answer)
   *  4. Return new array of top_condition
   */
  const topConditionsWithConditionValueTrue = filter(currentNode.top_conditions, (top_condition) => {
    const { conditionValue } = find(medicalCase.nodes[top_condition.first_node_id].qs, (qs) => {
      return qs.id === mcNode.id;
    });
    return conditionValue;
  });

  const tempNodeFiltered = {
    ...mcNode,
    top_conditions: topConditionsWithConditionValueTrue,
  };

  return calculateCondition(algorithm, tempNodeFiltered, medicalCase);
};

/**
 * Calculate condition of question sequence and these children
 * @param algorithm
 * @param medicalCase
 * @param mcNode
 * @returns {null|boolean}
 */
export const questionSequenceCalculateCondition = (algorithm, medicalCase, mcNode) => {
  const currentNode = algorithm.nodes[mcNode.id];
  return currentNode.category === categories.scored ? _questionSequenceScoredCalculateCondition(algorithm, medicalCase, mcNode) : _questionSequenceCalculateCondition(algorithm, medicalCase, mcNode);
};
