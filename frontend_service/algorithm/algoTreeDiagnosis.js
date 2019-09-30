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
 * Process the final QS
 *
 * If this is a direct link, get condition in the QS conditon
 *
 * @param instance
 * @param child
 * @param qs
 * @param isThisBranchNull
 * @return {boolean|false|true|null}
 */
export const nextChildFinalQs = (instance, child, qs, isThisBranchNull) => {
  // If the instance is an top level node
  if (instance.top_conditions.length === 0) {
    // This is a direct link we read the condition in the QS
    let child_top_condition = find(
      child.top_conditions,
      (top_condition) => top_condition.first_node_id === instance.id
    );

    // We get the condition of the direct link
    let qsRouteCondition = comparingTopConditions(child, child_top_condition);

    if (qs.id === 181 || qs.id === 186) {
      console.log(
        'direct link to the end of QS',
        qsRouteCondition,
        qs,
        instance
      );
    }

    if (qsRouteCondition === null) {
      isThisBranchNull.branch = null;
    }

    // IF the direct link is open
    return qsRouteCondition;
  } else {
    /**
     *  Here we reach the end of the tree
     *  This is not a direct link (top node level to final QS) because this is an other case
     */
    return true;
  }
};

/**
 *  Process child other QS
 *
 *  3 ways possible
 *    1 - Not answered AND not shown
 *    2 - Not answered AND shown
 *    3 - Answered AND shown
 *
 * The reset Qs is not here
 *
 * @param state$
 * @param child
 * @param childConditionValue
 * @param qs : Global QS
 * @param actions : Array redux
 * @param isThisBranchNull
 * @return {null|false|true}
 */
export const nextChildOtherQs = (
  state$,
  child,
  childConditionValue,
  qs,
  actions,
  isThisBranchNull
) => {
  /**
   *  If the sub QS has not a defined value yet, we update the sub Qs
   */
  if (qs.id === 181 || qs.id === 186) {
    console.log(child, childConditionValue, qs, actions, isThisBranchNull);
  }

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
    // IF the subQS is still possible
    if (subQs === null) {
      isThisBranchNull.branch = null;
    }
    return subQs;
  }

  /**
   * IF not answered but conditonValue true -> wait on user but still possible : return null
   */
  if (child.answer === null && childConditionValue === true) {
    isThisBranchNull.branch = null;
    return null;
  }

  /**
   * If the QS is answered and has to be shown
   */
  if (child.answer !== null && childConditionValue === true) {
    // Continue and go deeper
    let deeper = recursiveNodeQs(state$, qs.instances[child.id], qs, actions);

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
};

/**
 *
 *
 * @return boolean : the status of children
 *
 * Iterate the children and do action depending the child
 * Can be the QS (reach the end of tree) -> nextChildFinalQs()
 * Can be an other Qs -> nextChildOtherQs()
 * Can be an question
 *
 * @param state$ {Object}: store redux
 * @param instance {Object}: the instance node (parent of children)
 * @param qs {Object}: Question sequence
 * @param actions {Array}: Actions array redux
 * @param currentNode {Object}: Node
 * @param isThisBranchNull {Object}: flag for null
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
        // Can be an question or other QS
        actions.push(updateConditionValue(child.id, qs.id, false, qs.type));
      }
    }

    /**
     * If the child is the current QS
     */
    if (child.id === qs.id && child.type === nodesType.questionsSequence) {
      // The branch is open and we can set the answer of this QS
      let nextQs = nextChildFinalQs(instance, child, qs, isThisBranchNull);
      return nextQs;
    }

    /**
     * If the child is an other QS
     */
    if (child.type === nodesType.questionsSequence) {
      let nextother = nextChildOtherQs(
        state$,
        child,
        childConditionValue,
        qs,
        actions,
        isThisBranchNull
      );
      return nextother;
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
      /**
       * Here we return nothing because an question is never the final node in a QS
       */
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
  /**
   * Initial Var
   */
  let currentNode = state$.value.nodes[instance.id];
  let instanceConditionValue = find(currentNode.qs, (p) => p.id === qs.id)
    .conditionValue;

  /**
   * Update condition Value if the instance has to be shown
   * */
  if (instanceConditionValue === false) {
    actions.push(updateConditionValue(instance.id, qs.id, true, qs.type));
  }

  // if the node isn't answered yet we stop the algo
  // if (currentNode.answer === null) {
  //   return false;
  // }

  const instanceCondition = calculateCondition(instance);

  /**
   * Reset condition value
   * Hide the node if the instance condition is no longer valid BUT he was already shwon
   */
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

  /**
   * Special variable to setting the null return
   * Immutability with obj.property
   */
  let isThisBranchNull = { branch: 0 };

  /**
   * We process the instance children if
   * The condition is true AND The questions has an answer OR this is a top level node
   */
  if (
    instanceCondition === true &&
    (currentNode.answer !== null || instance.top_conditions.length === 0)
  ) {
    /**
     * From this point we can process all children and go deeper in the tree
     */
    let processChildren = InstanceChildrenOnQs(
      state$,
      instance,
      qs,
      actions,
      currentNode,
      isThisBranchNull
    );

    if (qs.id === 181 || qs.id === 186) {
      console.log(
        instance,
        'isOpen ?',
        processChildren,
        'potentiel',
        isThisBranchNull
      );
    }

    /**
     *  Here we have parcoured all the children
     */

    /**
     * If the immutability branch is null we stop the some
     */
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
 * @return boolean: return the status of the QS
 *
 * @params state$: All the state of the reducer
 * @params qs: The QS we want to get the status
 * @params actions: The array of Redux Actions
 */
export const getQuestionsSequenceStatus = (state$, qs, actions) => {
  let topLevelNodes = [];
  let allNodesAnsweredInQs = false; // By default false

  // Set top Level Nodes
  Object.keys(qs.instances).map((nodeId) => {
    if (qs.instances[nodeId].top_conditions.length === 0) {
      topLevelNodes.push(qs.instances[nodeId]);
    }
  });

  let pendingQs;
  // For each top parent node we do a some
  allNodesAnsweredInQs = topLevelNodes.some((topNode) => {
    // From this branch we go deeper
    let recursifNode = recursiveNodeQs(state$, topNode, qs, actions);

    if (qs.id === 181 || qs.id === 186) {
      console.log('this branch is : ', recursifNode, topNode);
    }

    // If this node is null, we set the pending and continue the other branch
    // .some() has to return something to be stopped
    if (recursifNode === null) pendingQs = true;

    // If we find one branch correctly open we stop the .some loop
    if (recursifNode) return true;
  });

  // If pending we return null
  if (pendingQs) {
    return null;
  }

  // Return the result of recursif
  // Can be True || False
  return allNodesAnsweredInQs;
};
