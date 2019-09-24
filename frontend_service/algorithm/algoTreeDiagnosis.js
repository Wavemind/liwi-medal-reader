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

  if (instanceConditionValue === true && instanceCondition === false) {
    actions.push(updateConditionValue(instance.id, qs.id, false, qs.type));
  }

  let qsFullyAnswered = null;

  if (instanceCondition === true && currentNode.answer !== null) {
    instance.children.map((childId) => {
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
          if (qsRouteCondition === true) {
            qsFullyAnswered = true;
          } else {
            if (qsFullyAnswered === null) {
              qsFullyAnswered = false;
            }
          }
        } else {
          qsFullyAnswered = true;
        }
      }

      // If the child is an other QS
      else if (child.type === nodesType.questionsSequence) {
        // If the sub QS has not a defined value yet, we update the conditionValue of the top level nodes
        if (child.answer === null && childConditionValue === false) {
          // Update condition Value Qs
          actions.push(updateConditionValue(child.id, qs.id, true, qs.type));

          return getQuestionsSequenceStatus(
            state$,
            state$.value.nodes[child.id],
            actions
          );
        }
      }

      // If the child is an question
      else if (child.type === nodesType.question) {
        // Next node is a question, go deeper
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
    });
    console.log(qsFullyAnswered);
    // We can calculatite it
    if (qsFullyAnswered === true) {
      return qsFullyAnswered;
    } else if (qsFullyAnswered === false) {
      return false;
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

  // For each top parent node
  allNodesAnsweredInQs = topLevelNodes.some((topNode) => {
    let rec = recursiveNodeQs(state$, topNode, qs, actions);
    if (qs.id === 181) {
      console.log(rec, topNode);
    }
    if (rec) return true;
  });

  return allNodesAnsweredInQs;
};
