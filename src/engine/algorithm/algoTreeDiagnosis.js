import reduce from 'lodash/reduce';
import find from 'lodash/find';
import {nodesType} from '../../../frontend_service/constants';


// Create the first batch from json based on triage priority
// TODO : Maybe build an object instead of rewriting the json
export const generateInitialBatch = (algorithmJson) => {
  const {nodes} = algorithmJson;
  algorithmJson.batches = [{name: '', current: false, nodes: []}];
  Object.keys(nodes).map((nodeId) => {
    if (nodes[nodeId].priority === 'triage') {
      algorithmJson.batches[0].nodes.push(nodeId);
    }
  });
  return algorithmJson;
};

// @param [Json] algorithmJsonMedicalCase
// @return [Json] algorithmJsonMedicalCase
// Set condition values of question in order to prepare them for second batch (before the triage one)
export const setInitialCounter = (algorithmJsonMedicalCase) => {
  const {
    diseases,
    nodes,
  } = algorithmJsonMedicalCase;

  Object.keys(nodes).map((nodeId) => {
    if (nodes[nodeId].type.match(/Question|PredefinedSyndrome/)) {
      nodes[nodeId].dd.map((dd) => {
        dd.conditionValue = diseases[dd.id].nodes[nodeId].top_conditions.length === 0;
      });

      // Map trough PS if it is in an another PS itself
      nodes[nodeId].ps.map((ps) => {
        setParentConditionValue(algorithmJsonMedicalCase, ps.id, nodeId);
      });
    }
  });

  return algorithmJsonMedicalCase;
};

// @params [Json][Integer][Integer] algorithmJsonMedicalCase, parentId, id
// Recursive function to also set dd and ps parents of current ps
export const setParentConditionValue = (algorithmJsonMedicalCase, parentId, id) => {
  let conditionValue = false;
  const {
    diseases,
    nodes,
  } = algorithmJsonMedicalCase;

  // Set condition value for DD if there is any
  if (!nodes[parentId].dd.isEmpty()) {
    nodes[parentId].dd.map((dd) => {
      dd.conditionValue = diseases[dd.id].nodes[parentId].top_conditions.length === 0;
    });
    conditionValue = true;
  }

  // Set condition value of parent PS if there is any
  if (!nodes[parentId].ps.isEmpty()) {
    // If parentNode is a PS, rerun function
    nodes[parentId].ps.map((ps) => {
      setParentConditionValue(algorithmJsonMedicalCase, ps.id, parentId);
    });
    conditionValue = true;
  }

  // Set conditionValue of current PS
  nodes[id].ps.map((ps) => {
    if (ps.id === parentId) {
      ps.conditionValue = nodes[ps.id].nodes[id].top_conditions.length === 0 && conditionValue;
    }
  });
};

// @params [Json] algorithmJsonMedicalCase
// @return [Json] algorithmJsonMedicalCase
// Get every nodes and identify which are ready for next batch
export const generateNextBatch = (algorithmJsonMedicalCase) => {
  const {
    nodes,
    batches,
  } = algorithmJsonMedicalCase;
  let newBatch = {name: '', current: false, nodes: []};

  Object.keys(nodes).map((nodeId) => {

    // Check if the question or ps has already been answered
    if (nodes[nodeId].type.match(/Question|PredefinedSyndrome/)) {
      let hasConditionValue = false;

      nodes[nodeId].dd.concat(nodes[nodeId].ps).map((parent) => {
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

        // Push in the next batch if the question or ps is not present in another batch
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


// TODO not working at 100%, fix it
const recursiveNodePs = (state$, node, ps) => {
  return node.children.some((nodeChildID) => {
    let nodeChild = state$.value.nodes[nodeChildID];
    // IF the child is OUR PS
    if (nodeChildID === ps.id && nodeChild.type === nodesType.ps) {
      // Calculate state of OUR PS

      return nodeConditionChecker(state$, null, null, ps);
    }
    // IF the child is an other PS
    if (nodeChild.type === nodesType.ps) {
      // Get state of this PS
    }

    // IF the child is an question
    if (nodeChild.type === nodesType.q) {
      // Next node is a question, get the state
      const nodeChildCondition = nodeConditionChecker(
        state$,
        null,
        null,
        ps.nodes[nodeChild.id]
      );
      // if this branch is open, so go deeper
      if (nodeChildCondition === true) {
        return recursiveNodePs(state$, nodeChild, ps);
      }
    }
  });
};

// TODO as well
export const getStateToThisPs = (state$, ps) => {
  let nodeTopParent = [];

  // Get top parent nodes
  Object.keys(ps.nodes).map((nodeId) => {
    if (ps.nodes[nodeId].top_conditions.length === 0) {
      nodeTopParent.push(ps.nodes[nodeId]);
    }
  });

  let cond = nodeTopParent.some((topParent) => {
    let childCond = recursiveNodePs(state$, topParent, ps);

    // Result of this branch
    if (childCond !== null) {
      return childCond;
    }
  });

  return cond;
};

// TODO: IN PROGRESS
export const nodeConditionChecker = (state$, indexDD, indexChild, child) => {
  // Loop for top_conditions
  let conditionFinal = child.top_conditions.map((conditions) => {
    return comparingTopConditions(state$, child, conditions);
  });
  // reduce here
  console.log(conditionFinal, 'conditionFinal');
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
