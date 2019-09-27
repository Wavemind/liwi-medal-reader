import find from 'lodash/find';
import { nodesType, priorities } from '../constants';
import { updateConditionValue } from '../actions/creators.actions';
import {
  calculateCondition,
  comparingTopConditions,
} from './algoConditionsHelpers';

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
      algorithmJson.batches?.first().nodes.push(nodeId);
    }

    if (nodes[nodeId].priority === priorities.mandatory) {
      algorithmJson.batches[1].nodes.push(nodeId);
    }
  });
  return algorithmJson; // return is useless, we modifiy ref to caller
};

/*
 * For each medicalCase who exclude other diagnostic, we set the id in both side.
 * */
export const generateExcludedId = (medicalCase) => {
  for (let index in medicalCase.nodes) {
    if (medicalCase.nodes.hasOwnProperty(index)) {
      let item = medicalCase.nodes[index];
      if (
        item.type === nodesType.finalDiagnostic &&
        item.excluding_final_diagnostics !== null
      ) {
        medicalCase.nodes[
          item.excluding_final_diagnostics
        ].excluded_by_final_diagnostics = item.id;
      }
    }
  }
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

/**
 *
 */
const InstanceChildrenOnQs = (
  state$,
  instance,
  qs,
  actions,
  currentNode,
  isThisBranchNull
) => {
  return instance.children.some((childId) => {
    let child = state$.value.nodes[childId];

    let childConditionValue;

    // If this is not the final QS we calculate the conditonValue of the child
    if (child.id !== qs.id) {
      childConditionValue = find(child.qs, (q) => q.id === qs.id)
        .conditionValue;

      // Reset the child condition value
      if (currentNode.answer === null && childConditionValue === true) {
        actions.push(updateConditionValue(child.id, qs.id, false, qs.type));
      }
    }

    // If the child is the current QS
    if (child.id === qs.id && child.type === nodesType.questionsSequence) {
      // The branch is open and we can set the answer of this QS

      // If top parent and child QS, this is a direct link we read other conditione
      if (instance.top_conditions.length === 0) {
        let child_top_condition = find(
          child.top_conditions,
          (top_condition) => top_condition.first_node_id === instance.id
        );
        let qsRouteCondition = comparingTopConditions(
          child,
          child_top_condition
        );
        if (qs.id === 181 || qs.id === 186) {
          console.log(
            'direct link to the end of QS',
            qsRouteCondition,
            qs,
            instance
          );
        }
        // IF the direct link is open
        return qsRouteCondition;
      } else {
        return true;
      }
    }

    // If the child is an other QS
    else if (child.type === nodesType.questionsSequence) {
      // If the sub QS has not a defined value yet, we update the conditionValue of the top level nodes
      if (child.answer === null && childConditionValue === false) {
        // Update condition Value Qs
        actions.push(updateConditionValue(child.id, qs.id, true, qs.type));

        let subQs = getQuestionsSequenceStatus(
          state$,
          state$.value.nodes[child.id],
          actions
        );
        if (qs.id === 181 || qs.id === 186) {
          console.log(subQs);
        }
        return subQs;
      } else if (child.answer === null && childConditionValue === true) {
        // IF not answered but conditonValue true _> wait on user but still possible : return null
        console.log('here we got a subqs open and waiting for answer');
        isThisBranchNull.branch = null;
        return null;
      } else if (child.answer !== null && childConditionValue === true) {
        // return the condition of the sub qs ??
        let deeper = recursiveNodeQs(
          state$,
          qs.instances[child.id],
          qs,
          actions
        );

        if (deeper === null) {
          isThisBranchNull.branch = null;
        }

        if (qs.id === 181) {
          console.log(deeper);
        }

        if (deeper === true) {
          return true;
        }
      }
    }

    // If the child is an question
    else if (child.type === nodesType.question) {
      // Next node is a question, go deeper
      let deeper = recursiveNodeQs(state$, qs.instances[child.id], qs, actions);

      if (deeper === null) {
        isThisBranchNull.branch = null;
      }

      if (qs.id === 181) {
        console.log(deeper);
      }
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
const recursiveNodeQs = (state$, instance, qs, actions) => {
  let currentNode = state$.value.nodes[instance.id];

  let instanceConditionValue = find(currentNode.qs, (p) => p.id === qs.id)
    .conditionValue;

  // If the node is not shown is this QS we change the conditon value to show it
  if (instanceConditionValue === false) {
    actions.push(updateConditionValue(instance.id, qs.id, true, qs.type));
  }

  // if the node isn't answered yet we stop the algo
  // if (currentNode.answer === null) {
  //   return false;
  // }

  // If answer is not null We check the condition of this node
  const instanceCondition = calculateCondition(instance);

  // Reset this instance conditionValue
  if (instanceConditionValue === true && instanceCondition === false) {
    actions.push(updateConditionValue(instance.id, qs.id, false, qs.type));
  }

  if (qs.id === 181 || qs.id === 186) {
    console.log(
      instance.id,
      instanceConditionValue,
      instanceCondition,
      instance,
      currentNode
    );
  }

  let isThisBranchNull = { branch: 0 }; // true = yes, null = potentiel, false = no, // immutability
  // IF condition is respected and the answer is not null
  // TODO reset the sub child
  /// TODO detect when reset top_parent condition ?
  if (
    instanceCondition === true &&
    (currentNode.answer !== null || instance.top_conditions.length === 0)
  ) {
    // Is this branch open to the end of QS ?
    let processChildren = InstanceChildrenOnQs(
      state$,
      instance,
      qs,
      actions,
      currentNode,
      isThisBranchNull
    );

    if (qs.id === 181 || qs.id === 186) {
      console.log('isOpen ?', processChildren, 'potentiel', isThisBranchNull);
    }

    // Here we have parcoured all the children if the instance
    if (isThisBranchNull.branch === null) {
      return null;
    }

    return processChildren;
    // We can calculatite it
  } else {
    // The node hasn't the expected answer BUT we are not a the end of the QS
    return null;
  }
};

/**
 * 1. Get all nodes without conditons
 * 2. On each node we do work on his children (like change conditon value or check conditon of the child)
 * 3. Update Recursive QS
 *
 * @return boolean: can we reach the end of the QS
 *
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
  let pendingQs;
  // For each top parent node
  allNodesAnsweredInQs = topLevelNodes.some((topNode) => {
    let rec = recursiveNodeQs(state$, topNode, qs, actions);
    if (qs.id === 181 || qs.id === 186) {
      console.log('this branch is : ', rec, topNode);
    }
    if (rec === null) pendingQs = true;
    if (rec) return true;
  });

  if (pendingQs) {
    return null;
  }

  return allNodesAnsweredInQs;
};
