import reduce from 'lodash/reduce';
import {
  diagnosisChildren,
  predefinedSyndromeChildren,
  diseasesChildren,
} from '../actions/creators.actions';
import find from 'lodash/find';
import { nodesType } from '../../utils/constants';

export const generateInitialBatch = (medicalCase) => {
  console.log(medicalCase);
  const { nodes, diseases, batchs } = medicalCase;
  medicalCase.batchs = [{ name: '', current: false, nodes: [] }];
  Object.keys(nodes).map((nodeId) => {
    if (nodes[nodeId].priority === 'triage') {
      medicalCase.batchs[0].nodes.push(nodeId);
    }
  });
  return medicalCase;
};

export const generateNextBatch = (medicalCase) => {
  console.log(medicalCase);
  const { nodes, diseases, batchs } = medicalCase;
  let newBatch = { name: '', current: false, nodes: [] };

  Object.keys(nodes).map((nodeId) => {
    // Is this PS show in a dd ?
    let conditionValueAtLeastInDD = find(
      nodes[nodeId].dd,
      (k) => k.conditionValue === true
    );

    let conditionValueAtLeastInPS = find(
      nodes[nodeId].ps,
      (k) => k.conditionValue === true
    );

    // there is a conditionValue at true
    if (
      conditionValueAtLeastInDD !== undefined ||
      conditionValueAtLeastInPS !== undefined
    ) {
      let findInOtherBatch = true;

      // Find recursive
      batchs.map((b) => {
        let duplicate = find(b.nodes, (a) => a === nodeId);
        if (duplicate) {
          findInOtherBatch = false;
        }
      });

      // If question was already asked
      if (findInOtherBatch) {
        newBatch.nodes.push(nodeId);
      }
    }
  });
  if (newBatch.nodes.length > 0) {
    medicalCase.batchs.push(newBatch);
  }
  return medicalCase;
};

export const setInitialCounter = (medicalCase) => {
  const { diseases, nodes } = medicalCase;

  Object.keys(nodes).map((nodeId) => {
    if (nodes[nodeId].type.match(/Question|PredefinedSyndrome/)) {
      nodes[nodeId].dd.map((dd, index) => {
        // dd.conditionValue =
        //   diseases[dd.id].nodes[nodeId].top_conditions.length === 0;
        nodes[nodeId].dd[index] = {
          id: dd,
          conditionValue:
            diseases[dd].nodes[nodeId].top_conditions.length === 0,
        };
      });
    }
  });

  // Twice Loop because we need to set dd before ps because  ps in ps in dd...
  Object.keys(nodes).map((nodeId) => {
    if (nodes[nodeId].type.match(/Question|PredefinedSyndrome/)) {
      nodes[nodeId].ps.map((ps, index) => {
        let conditionValueAtLeast;

        // Is this PS show in a dd ?
        // conditionValueAtLeast = find(
        //   nodes[ps.id].dd,
        //   (k) => k.conditionValue === true
        // );
        //
        // // there is a conditionValue at true
        // if (conditionValueAtLeast !== undefined) {
        //   conditionValueAtLeast = true;
        // } else {
        //   conditionValueAtLeast = null;
        // }
        conditionValueAtLeast = find(
          nodes[ps].dd,
          (k) => k.conditionValue === true
        );

        // there is a conditionValue at true
        if (conditionValueAtLeast !== undefined) {
          conditionValueAtLeast = true;
        }

        nodes[nodeId].ps[index] = {
          id: ps,
          conditionValue:
            nodes[ps].nodes[nodeId].top_conditions.length === 0 &&
            conditionValueAtLeast,
        };
        // set conditioValue for this ps in this node
        // ps.conditionValue =
        //   nodes[ps.id].nodes[nodeId].top_conditions.length === 0 &&
        //   conditionValueAtLeast;
      });
    }
  });

  return medicalCase;
};

export const nodeConditionChecker = (state$, indexDD, indexChild, child) => {
  // Loop for top_conditions
  let conditionFinal = child.top_conditions.map((conditions) => {
    return comparingTopConditions(state$, child, conditions);
  });
  // reduce here
  console.log(conditionFinal);
  const reduceConditionArrayBoolean = reduce(
    conditionFinal,
    (result, value) => {
      return comparingBooleanOr(result, value);
    },
    false
  );

  return reduceConditionArrayBoolean;
};

// Algo Boolean OR from FTA, thanks to US <3
const comparingBooleanOr = (booleanOne, booleanTwo) => {
  if (
    (booleanOne === null && booleanTwo === false) ||
    (booleanOne === false && booleanTwo === null) ||
    (booleanOne === null && booleanTwo === null) ||
    (booleanOne === null && booleanTwo === null)
  ) {
    return null;
  }

  if (booleanOne === true || booleanTwo === true) {
    return true;
  }

  if (booleanOne === false && booleanTwo === false) {
    return false;
  }
};
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

    // console.log(
    //   conditions,
    //   'secondAnswer = ',
    //   first_id,
    //   'firstAnswer = ',
    //   second_id,
    //   'second_sub_condition =',
    //   second_sub_condition,
    //   'first_sub_condition =',
    //   first_sub_condition
    // );

    if (operator === 'AND') {
      return first_sub_condition && second_sub_condition;
    } else if (operator === 'OR') {
      return comparingBooleanOr(first_sub_condition, second_sub_condition);
    }
  }
  return null;
}; // Index node
export const actionFactoryTypeNode = (state$, indexNode, indexChild, type) => {
  // indexNode = Parent node
  // indexChild = node that is affected by it
  let arrayActions = [];
  let childrenNodes;

  // WORKAROUND because they dont want diseases in nodes
  if (type === null) {
    type = state$.value.nodes[indexChild].type;
  }

  console.log(type, indexNode, indexChild);

  switch (type) {
    case nodesType.q:
      // Go to this sample question
      return diseasesChildren(indexNode, indexChild);
    case nodesType.t:
      // Treatment
      break;
    case nodesType.fd:
      // Ho next node is Final Diagnostic
      return diagnosisChildren(indexNode, indexChild);
    case nodesType.m:
      break;
    case nodesType.d:
      // NEXT CHILDREN
      // This node affects a disease, we go on the children of this node in this diseases
      childrenNodes =
        state$.value.diseases[indexChild].nodes[indexNode].children;
      childrenNodes.map((childId) => {
        // We will see the type of child of this node and perform the right action
        let typeOfChildren = actionFactoryTypeNode(
          state$,
          indexChild,
          childId,
          null
        );
        console.log(typeOfChildren);
        arrayActions.push(typeOfChildren);
      });
      break;
    case nodesType.ps:
      // PS EFFECT CHANGE !
      console.log(
        'change ps ',
        state$.value.nodes[indexChild],
        state$.value.nodes[indexNode].type
      );
    // Calcul change of PS

    // HERE
    // if (state$.value.nodes[indexNode].type) {
    // }
    // return [predefinedSyndromeChildren(indexNode, indexChild)];
  }

  return arrayActions;
};
