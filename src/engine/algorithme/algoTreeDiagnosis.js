import reduce from 'lodash/reduce';
import {
  diagnosisChildren,
  diseasesChildren,
} from '../actions/creators.actions';

export const setInitialCounter = (medicalCase) => {
  console.log(medicalCase);
  const { diseases, nodes } = medicalCase;
  console.log(diseases);
  Object.keys(diseases).map((diseaseId) =>
    Object.keys(diseases[diseaseId].nodes).map((nodeId) => {
      console.log(nodeId);
      // there are no condition
      if (diseases[diseaseId].nodes[nodeId].top_conditions.length === 0) {
        nodes[nodeId].counter = nodes[nodeId].counter + 1;
      }
    })
  );

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

  switch (type) {
    case 'Question':
      // Go to this sample question
      return diseasesChildren(indexNode, indexChild);
    case 'Treatment':
      break;
    case 'FinalDiagnostic':
      // Ho next node is Final Diagnostic
      return diagnosisChildren(indexNode, indexChild);
    case 'Management':
      break;
    case 'diseases':
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
        arrayActions.push(typeOfChildren);
      });
      break;
    case 'PredefinedSyndrome':
      console.log(state$.value.nodes[indexChild]);
      // Calcul change of PS
      break;
  }

  return arrayActions;
};
