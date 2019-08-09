import reduce from 'lodash/reduce';
import find from 'lodash/find';
import { nodesType, priorities } from '../constants';
import {
  conditionValueQSChange,
  questionsSequencesChildren,
} from '../actions/creators.actions';

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
            diagnostics[dd.id].nodes[nodeId].top_conditions.length === 0;
        });

        // Map trough PS if it is in an another PS itself
        nodes[nodeId].qs.map((qs) => {
          setParentConditionValue(algorithmJsonMedicalCase, qs.id, nodeId);
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
        diagnostics[dd.id].nodes[parentId].top_conditions.length === 0;
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
        nodes[qs.id].nodes[id].top_conditions.length === 0 && conditionValue;
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
export const getParentsOfThisNode = (state$, diseaseId, nodeId) => {
  let parents = [];

  let top_conditions =
    state$.value.diagnostics[diseaseId].nodes[nodeId].top_conditions;

  top_conditions.map((top) => {
    parents.push(top.first_node_id);
    if (top.second_type !== null) {
      parents.push(top.second_node_id);
    }
  });

  return parents;
};

// TODO not working at 100%, fix it
const recursiveNodePs = (state$, node, qs, actions) => {
  let findConditionValueQs = find(
    state$.value.nodes[node.id].qs,
    (p) => p.id === qs.id
  ).conditionValue;

  // if not answered we show it
  if (
    state$.value.nodes[node.id].answer === null &&
    findConditionValueQs.conditionValue === false
  ) {
    return actions.push(conditionValueQSChange(node.id, qs.id, true));
  }

  if (
    state$.value.nodes[node.id].answer === null &&
    findConditionValueQs === true
  ) {
    // the question is not answered but already shown, and stop and wait on the user
    return;
  }

  // We check the condition of this node
  const nodeCondition = nodeConditionChecker(state$, null, null, node);

  // If top parent or condition === true
  if (nodeCondition === true) {
    node.children.map((nodeChildID) => {
      let nodeChild = state$.value.nodes[nodeChildID];

      // IF the child is OUR PS
      if (nodeChildID === qs.id && nodeChild.type === nodesType.questionsSequence) {
        // Top parent and child is QS
        // The branch is open and we can set the answer of this QS
        return;
        //return nodeConditionChecker(state$, null, null, qs);
      }

      // IF the child is an other QS
      if (nodeChild.type === nodesType.questionsSequence && nodeChildID !== qs.id) {
        console.warn(nodeChild, 'Get state of this other PS');

        // If the sub QS is null and show the sub question
        if (state$.value.nodes[nodeChild.id].answer === null) {
          actions.push(questionsSequencesChildren(nodeChild.id, qs.id));
        } else {
          recursiveNodePs(state$, qs.nodes[nodeChild.id], qs, actions);
        }
      }

      // IF the child is an question
      if (nodeChild.type === nodesType.question) {
        // Next node is a question, get the state
        // go deeper
        recursiveNodePs(state$, qs.nodes[nodeChild.id], qs, actions);
      }
    });
  }
};

// TODO as well
export const getStateToThisPs = (state$, qs, actions) => {
  let nodeTopParent = [];

  // Get top parent nodes
  Object.keys(qs.nodes).map((nodeId) => {
    if (qs.nodes[nodeId].top_conditions.length === 0) {
      nodeTopParent.push(qs.nodes[nodeId]);
    }
  });
  // For each top parent node
  nodeTopParent.map((topParent) =>
    recursiveNodePs(state$, topParent, qs, actions)
  );
  return actions;
};

// TODO: IN PROGRESS
export const nodeConditionChecker = (state$, indexDD, indexChild, child) => {

  // If this is a top parent node
  if (child.top_conditions.length === 0) {
    return true;
  }

  // Loop for top_conditions
  let conditionFinal = child.top_conditions.map((conditions) => {
    return comparingTopConditions(state$, child, conditions);
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
