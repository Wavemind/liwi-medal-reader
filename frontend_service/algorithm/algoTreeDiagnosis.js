import reduce from 'lodash/reduce';
import find from 'lodash/find';
import { nodesType, priorities } from '../constants';
import { updateConditionValue } from '../actions/creators.actions';

// Create the first batch from json based on triage priority
// TODO : Maybe build an object instead of rewriting the json
export const generateInitialBatch = (algorithmJson) => {
  const { nodes } = algorithmJson;

  algorithmJson.batches = [
    { name: 'Triage', current: false, nodes: [] },
    { name: 'Mandatory', current: false, nodes: [] },
  ];
  Object.keys(nodes).map((nodeId) => {
    if (nodes[nodeId].priority === priorities.triage) {
      algorithmJson.batches[0].nodes.push(nodeId);
    }

    if (nodes[nodeId].priority === priorities.mandatory) {
      algorithmJson.batches[1].nodes.push(nodeId);
    }
  });
  return algorithmJson; // return is useless, we modifiy ref to caller
};

// @param [Json] algorithmJsonMedicalCase
// @return [Json] algorithmJsonMedicalCase
// Set condition values of question in order to prepare them for second batch (before the triage one)
export const setInitialCounter = (algorithmJsonMedicalCase) => {
  const { diagnostics, nodes } = algorithmJsonMedicalCase;

  try {
    Object.keys(nodes).map((nodeId) => {
      if (nodes[nodeId].type.match(/Question|PredefinedSyndrome/)) {
        nodes[nodeId].dd.map((dd) => {
          dd.conditionValue =
            diagnostics[dd.id].instances[nodeId].top_conditions.length === 0;
        });

        // Map trough PS if it is in an another PS itself
        nodes[nodeId].qs.map((qs) => {
          setParentConditionValue(algorithmJsonMedicalCase, qs.id, nodeId);
        });
      }
    });

    // Set question Formula
    Object.keys(nodes).map((nodeId) => {
      if (nodes[nodeId].type.match(/Question/)) {
        // TODO remove it when json ready
        if (nodeId == 108 || nodeId == 111) {
          nodes[nodeId].fn = [
            {
              id: 278,
              conditionValue: false,
            },
          ];
        } else {
          nodes[nodeId].fn = [];
        }
        nodes[nodeId].fn.map((fn) => {
          let fdd = nodes[fn.id].dd.some((e) => e.conditionValue);
          let fqs = nodes[fn.id].qs.some((e) => e.conditionValue);
          if (fdd || fqs) fn.conditionValue = true;
        });
      }
    });
  } catch (e) {
    console.warn(e);
  }

  return algorithmJsonMedicalCase;
};

// @params [Json][Integer][Integer] algorithmJsonMedicalCase, parentId, id
// Recursive function to also set dd and qs parents of current qs
export const setParentConditionValue = (
  algorithmJsonMedicalCase,
  parentId,
  id
) => {
  let conditionValue = false;
  const { diagnostics, nodes } = algorithmJsonMedicalCase;

  // Set condition value for DD if there is any
  if (!nodes[parentId].dd.isEmpty()) {
    nodes[parentId].dd.map((dd) => {
      dd.conditionValue =
        diagnostics[dd.id].instances[parentId].top_conditions.length === 0;
    });
    conditionValue = true;
  }

  // Set condition value of parent QS if there is any
  if (!nodes[parentId].qs.isEmpty()) {
    // If parentNode is a QS, rerun function
    nodes[parentId].qs.map((qs) => {
      setParentConditionValue(algorithmJsonMedicalCase, qs.id, parentId);
    });
    conditionValue = true;
  }

  // Set conditionValue of current QS
  nodes[id].qs.map((qs) => {
    if (qs.id === parentId) {
      qs.conditionValue =
        nodes[qs.id].instances[id].top_conditions.length === 0 &&
        conditionValue;
    }
  });
};

// @params [Json] algorithmJsonMedicalCase
// @return [Json] algorithmJsonMedicalCase
// Get every nodes and identify which are ready for next batch
export const generateNextBatch = (algorithmJsonMedicalCase) => {
  const { nodes, batches } = algorithmJsonMedicalCase;
  let newBatch = { name: '', current: false, nodes: [] };

  Object.keys(nodes).map((nodeId) => {
    // Check if the question or qs has already been answered
    if (nodes[nodeId].type.match(/Question|PredefinedSyndrome/)) {
      let hasConditionValue = false;

      nodes[nodeId].dd.concat(nodes[nodeId].qs).map((parent) => {
        if (parent.conditionValue === true) {
          hasConditionValue = true;
        }
      });

      if (hasConditionValue) {
        let isInBatch = false;

        // Find if the node is not already in another batch
        batches.map((b) => {
          let duplicate = find(b.nodes, (a) => a === nodeId);
          if (duplicate) {
            isInBatch = true;
          }
        });

        // Push in the next batch if the question or qs is not present in another batch
        if (!isInBatch) {
          newBatch.nodes.push(nodeId);
        }
      }
    }
  });

  if (!newBatch.nodes.isEmpty()) {
    algorithmJsonMedicalCase.batches.push(newBatch);
  }

  return algorithmJsonMedicalCase;
};

// Node from diagnostics !
export const getParentsNodes = (state$, diagnosticId, nodeId) => {
  let parentsNodes = [];

  let top_conditions =
    state$.value.diagnostics[diagnosticId].instances[nodeId].top_conditions;

  top_conditions.map((top) => {
    parentsNodes.push(top.first_node_id);
    if (top.second_type !== null) {
      parentsNodes.push(top.second_node_id);
    }
  });

  return parentsNodes;
};

// TODO not working at 100%, fix it
/**
 * Get
 *
 * @trigger When a condition value must be change
 * @payload nodeId: Question or QuestionsSequence
 * @payload callerId: Diagnostic or QuestionsSequence
 * @payload value: new condition value
 * @payload type: define if it's a diagnostic or a question sequence
 */
const recursiveNodeQs = (state$, instance, qs, actions) => {
  let currentNode = state$.value.nodes[instance.id];

  let instanceConditionValue = find(currentNode.qs, (p) => p.id === qs.id)
    .conditionValue;

  // If the node is not shown is this QS we change the conditon value to show it
  if (instanceConditionValue === false) {
    actions.push(updateConditionValue(instance.id, qs.id, true, qs.type));
  }

  // if the node isn't answered yet we stop the algo
  if (currentNode.answer === null) {
    return false;
  }

  // If answer is not null We check the condition of this node
  const instanceCondition = calculateCondition(state$, instance);
  let qsFullyAnswered = null;
  // If instance condition === true
  if (instanceCondition === true) {
    qsFullyAnswered = instance.children.some((childId) => {
      let child = state$.value.nodes[childId];

      if (child.id === qs.id && child.type === nodesType.questionsSequence) {
        // The branch is open and we can set the answer of this QS
        return true;
      }

      // IF the child is an other QS
      else if (
        child.id === qs.id &&
        child.type === nodesType.questionsSequence
      ) {
        // If the sub QS is null and show the sub question
        if (child.answer === null) {
          getQuestionsSequenceStatus(state$, state$.nodes[child.id], actions);
        }
      }

      // IF the child is an question
      else if (child.type === nodesType.question) {
        // Next node is a question, get the state
        // go deeper
        return recursiveNodeQs(state$, qs.instances[child.id], qs, actions);
      } else {
        console.warn(
          '%c --- DANGER --- ',
          'background: #FF0000; color: #F6F3ED; padding: 5px',
          'This QS',
          qs,
          'You do not have to be here !! child in QS is wrong for : ',
          child
        );
      }

      // we have children and and can continue
    });

    if (qsFullyAnswered === true) {
      return qsFullyAnswered;
    }
  } else {
    // The node hasn't the expected answer so we stop the algo
    return false;
  }
};

/**
 * 1. Get all nodes without conditons
 * 2. On each node we do work on his children (like change conditon value or check conditon of the child)
 * 3. Update Recursive QS
 *
 * @return boolean: can we calculate this QS ?
 * @params state$: All the state of the reducer
 * @params qs: The QS we want to get the status
 * @params actions: The array of Redux Actions
 */
export const getQuestionsSequenceStatus = (state$, qs, actions) => {
  let topLevelNodes = [];
  let allNodesAnsweredInQs = false;

  // Set top Level Nodes
  Object.keys(qs.instances).map((nodeId) => {
    if (qs.instances[nodeId].top_conditions.length === 0) {
      topLevelNodes.push(qs.instances[nodeId]);
    }
  });

  // TODO SOME ??
  // For each top parent node
  allNodesAnsweredInQs = topLevelNodes.some((topNode) => {
    let rec = recursiveNodeQs(state$, topNode, qs, actions);
    if (rec) return true;
  });
  // return actions;
  return allNodesAnsweredInQs;
};

// TODO: IN PROGRESS
export const calculateCondition = (state$, node) => {

  // If this is a top parent node
  if (node.top_conditions.length === 0) {
    return true;
  }

  // Loop for top_conditions
  let conditionFinal = node.top_conditions.map((conditions) => {
    return comparingTopConditions(state$, node, conditions);
  });
  // reduce here

  const reduceConditionArrayBoolean = reduce(
    conditionFinal,
    (result, value) => {
      return comparingBooleanOr(result, value);
    },
    false
  );

  return reduceConditionArrayBoolean;
};

// @params [Object] state$, [Object] node
// Calculate formula
export const calculateFormula = (state$, node) => {
  // Regex to find []
  const findBrackertId = /\[(.*?)\]/gi;
  let ready = true;

  // Function to change the [id] into the good value
  const functionReplacing = (item) => {
    // Get the id into []
    let id = item.match(/\d/g).join('');

    // Get value of this node
    const nodeValue = state$.value.nodes[id].value;

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

// TODO: IN PROGRESS
const checkOneCondition = (state$, child, wantedId, nodeId, conditionType) => {
  switch (conditionType) {
    case 'Answer':
      if (state$.value.nodes[nodeId].answer !== null) {
        // pas sur
        //  Unless it's a priority.
        return state$.value.nodes[nodeId].answer === wantedId;
      }

      return null;

    case 'Condition':
      // TODO here check the id condition nested hooo....
      break;
  }
};

// TODO: IN PROGRESS
const comparingTopConditions = (state$, child, conditions) => {
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
    state$,
    child,
    first_id,
    first_node_id,
    first_type
  );

  if (operator === null) {
    return first_sub_condition;
  } else {
    second_sub_condition = checkOneCondition(
      state$,
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

// @params [Boolean] firstBoolean [Boolean] secondBoolean
// @return [Boolean]
// Return value from both booleans
//
//       | True | False | Null
// ____________________________
// True  | True | True  | True
// ____________________________
// False | True | False | Null
// ____________________________
// Null  | True | Null  | Null
//
const comparingBooleanOr = (firstBoolean, secondBoolean) => {
  if (firstBoolean === true || secondBoolean === true) {
    return true;
  } else if (firstBoolean === false && secondBoolean === false) {
    return false;
  } else if (firstBoolean === null || secondBoolean === null) {
    return null;
  }
};
