// @flow
import filter from 'lodash/filter';
import find from 'lodash/find';
import * as _ from 'lodash';

import { calculateCondition, comparingTopConditions, reduceConditionArrayBoolean } from '../algorithm/conditionsHelpers.algo';
import { categories, nodeTypes } from '../constants';
import { updateConditionValue } from '../algorithm/epics.algo';
import { questionBooleanValue } from './Question.model';

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
  return calculateCondition(algorithm, currentNode, medicalCase);
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

/**
 * Process the final QS
 *
 * If this is a direct link, get condition in the QS condition
 *
 * @param instance {Object} : The node we are working
 * @param finalQs {Object} : The child of the link, in this case this is the final Qs
 * @return {boolean|false|true|null}
 */
export const nextChildFinalQs = (algorithm, instance, finalQs, medicalCase) => {
  const currentQuestionSequence = algorithm.nodes[finalQs.id];
  const top_conditions = _.filter(currentQuestionSequence.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
  // We get the condition of the final link
  const arrayBoolean = top_conditions.map((condition) => {
    return comparingTopConditions(condition, medicalCase);
  });
  return reduceConditionArrayBoolean(arrayBoolean);
};

/**
 * Iterate on every node present in a QS, for each node we call a specific function based on node type
 * - If the node is the current QS (reached the end of tree) -> nextChildFinalQs()
 * - If the node is an other Qs -> nextChildOtherQs()
 * - If the node is a regular node -> Continue to process nodes
 * @param algorithm
 * @param medicalCase
 * @param instance
 * @param mcQs
 * @param mcNode
 * @return boolean : the status of children
 */
const processQSChildren = (algorithm, medicalCase, instance, mcQs, mcNode) => {
  const currentQs = algorithm.nodes[mcQs.id];

  return instance.children.map((childId) => {
    const mcChildNode = medicalCase.nodes[childId];
    let childConditionValue;
    // If this is not the final QS we calculate the conditionValue of the mcNode
    if (mcNode.id !== mcQs.id) {
      childConditionValue = find(mcNode.qs, (q) => q.id === mcQs.id).conditionValue;
      // Reset the mcNode condition value
      if (mcNode.answer === null && childConditionValue === true) {
        // Can be an question or other QS
        updateConditionValue(algorithm, medicalCase, mcChildNode.id, mcQs.id, false, mcQs.type);
      }
    }

    // If the mcChild is the current QS
    if (mcChildNode.id === mcQs.id && mcChildNode.type === nodeTypes.questionsSequence) {
      // The branch is open and we can set the answer of this QS
      return nextChildFinalQs(algorithm, instance, mcChildNode, medicalCase);
    }
    if (mcChildNode.type === nodeTypes.question || mcChildNode.type === nodeTypes.questionsSequence) {
      return recursiveNodeQs(algorithm, medicalCase, currentQs.instances[mcChildNode.id], mcQs.id);
    }
  });
};

/**
 * Calculate and update questions sequence and their children condition value
 *
 * @trigger When a condition value must be change
 * @payload nodeId: Question or QuestionsSequence
 * @payload callerId: Diagnostic or QuestionsSequence
 * @payload value: new condition value
 * @payload type: define if it's a diagnostic or a question sequence
 */
export const recursiveNodeQs = (algorithm, medicalCase, instance, qsId) => {
  let isReset = false;
  const mcNode = medicalCase.nodes[instance.id];
  const mcQs = medicalCase.nodes[qsId];
  const instanceConditionValue = find(mcNode.qs, (p) => p.id === mcQs.id).conditionValue;

  // If all the conditionValues of the QS are false we set the conditionValues of the node to false
  const qsInstances = mcQs.dd.concat(mcQs.qs);
  const qsConditionValue = qsInstances.some((qsInstance) => qsInstance.conditionValue);

  //  Get the condition of the instance link
  let instanceCondition = qsConditionValue && calculateCondition(algorithm, instance, medicalCase);

  if (instanceCondition === null) instanceCondition = false;
  // Update condition Value if the instance has to be shown
  if (instanceConditionValue === false && instanceCondition === true) {
    updateConditionValue(algorithm, medicalCase, instance.id, mcQs.id, true, mcQs.type);
  }

  // Reset condition value / Hide the node if the instance condition is no longer valid BUT he was already shown
  if (instanceConditionValue === true && instanceCondition === false) {
    isReset = true;
    updateConditionValue(algorithm, medicalCase, instance.id, mcQs.id, false, mcQs.type);
  }

  // Not shown before and the link condition is false -> return false
  if (instanceConditionValue === false && instanceCondition === false) return false;

  // We process the instance children if the condition is true AND The questions has an answer OR this is a top level node
  if (mcNode.answer !== null && (instance.top_conditions.length === 0 || isReset)) {
    // From this point we can process all children and go deeper in the tree processChildren return the boolean array of each branch
    const processChildren = processQSChildren(algorithm, medicalCase, instance, mcQs, mcNode);
    return reduceConditionArrayBoolean(processChildren);
  }

  // The node hasn't the expected answer BUT we are not a the end of the QS
  return null;
};

/**
 * For each topLevel Node ( nodes with no conditions ) we are going to check if we can reach the end of the QS
 *
 * @params state$: All the state of the reducer
 * @params qs: The QS we want to get the status
 * @params actions: The array of Redux Actions
 *
 * @return boolean: return the status of the QS
 *      true = can reach the end
 *      null = Still possible but not yet
 *      false = can't access the end anymore
 */
export const getQuestionsSequenceStatus = (algorithm, medicalCase, mcQs) => {
  const currentNode = algorithm.nodes[mcQs.id];

  if (currentNode.conditioned_by_cc.length > 0) {
    const isExcludedByComplaintCategory = currentNode.conditioned_by_cc.some((complaintCategory) => {
      return questionBooleanValue(algorithm, medicalCase.nodes[complaintCategory]) === false;
    });
    // Stop if QS is excluded
    if (isExcludedByComplaintCategory) {
      return false;
    }
  }

  // Check if we can reach the end of questionSequences
  const allNodesAnsweredInQs = getTopLevelNodes(currentNode).map((instance) => {
    return getQuestionsSequenceChildrenStatus(algorithm, medicalCase, instance, currentNode);
  });

  return reduceConditionArrayBoolean(allNodesAnsweredInQs);
};

/**
 * Get the top level nodes of a QS
 * @param node : Question Sequence
 * @returns [Array] : array of top level nodes
 */
export const getTopLevelNodes = (node) => {
  return Object.keys(node.instances)
    .filter((nodeId) => node.instances[nodeId].top_conditions.length === 0)
    .map((nodeId) => node.instances[nodeId]);
};

/**
 * Try to reach the end of questionSequences. Otherwise, return null (not possible for the moment) | false (not possible)
 * @param algorithm
 * @param medicalCase
 * @param instance
 * @param mcQs
 * @returns {null|boolean}
 */
const getQuestionsSequenceChildrenStatus = (algorithm, medicalCase, instance, mcQs) => {
  const condition = calculateCondition(algorithm, instance, medicalCase);
  const mcNode = medicalCase.nodes[instance.id];

  if (condition === null) return null;
  if (condition === false) return false;

  if (instance.children.length > 0) {
    return reduceConditionArrayBoolean(
      instance.children.map((childId) => {
        let childParentHasCorrectAnswer = true;
        const topConditions = childId !== mcQs.id ? mcQs.instances[childId].top_conditions : mcQs.top_conditions;

        if (topConditions.length > 1) {
          childParentHasCorrectAnswer = topConditions.some((condition) => {
            if (condition.first_node_id === mcNode.id) {
              return mcNode.answer === condition.first_id;
            }
          });
        }

        if (childId !== mcQs.id) {
          // Check if parent has the right answer.
          return childParentHasCorrectAnswer && getQuestionsSequenceChildrenStatus(algorithm, medicalCase, mcQs.instances[childId], mcQs);
        }

        return childParentHasCorrectAnswer && calculateCondition(algorithm, mcQs, medicalCase);
      })
    );
  }
  return condition;
};

/**
 * Gest the id of the answer of a QS based on the value in params
 * @param qs: related QS
 * @param value : Boolean value wanted
 * @returns Id of the answer
 */
export const getQsAnswer = (qs, value) => {
  if (value) {
    return qs.answers[Object.keys(qs.answers)[0]].id;
  }
  return qs.answers[Object.keys(qs.answers)[1]].id;
};
