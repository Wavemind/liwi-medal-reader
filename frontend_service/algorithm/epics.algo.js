/* eslint-disable no-param-reassign */
import { combineEpics, ofType } from 'redux-observable';
import find from 'lodash/find';
import {asyncScheduler, of} from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import moment from 'moment';
import { actions } from '../actions/types.actions';
import { displayFormats, nodeTypes } from '../constants';
import {
  dispatchFinalDiagnosticAction,
  dispatchCondition,
  dispatchNodeAction,
  dispatchQuestionsSequenceAction,
  setAnswer,
  dispatchRelatedNodeAction,
  updateMedicalCaseProperty,
  setDiagnoses,
  setMedicalCase,
} from '../actions/creators.actions';
import { getParentsNodes, getQuestionsSequenceStatus } from './treeDiagnosis.algo';
import NavigationService from '../../src/engine/navigation/Navigation.service';
import { DiagnosticModel } from '../engine/models/Diagnostic.model';
import {MedicalCaseModel} from '../engine/models/MedicalCase.model';
import {NodesModel} from '../engine/models/Nodes.model';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state is updated. */

export const updateConditionValue = (medicalCase, nodeId, callerId, value, type) => {
  let caller;

  switch (type) {
    case nodeTypes.diagnostic:
      caller = medicalCase.nodes[nodeId].dd;
      break;
    case nodeTypes.questionsSequence:
      caller = medicalCase.nodes[nodeId].qs;
      break;
  }

  const currentConditionValue = find(caller, (d) => d.id === callerId).conditionValue;

  // If not the same condition update the node
  if (currentConditionValue !== value) {
    // Update counter conditionValue
    if (value === true) {
      medicalCase.nodes[nodeId].counter += 1;
    } else if (value === false) {
      medicalCase.nodes[nodeId].counter -= 1;
    }
    currentConditionValue.conditionValue = value;
  }
  caller = caller.map((conditionValue) => {
    if (conditionValue.id === callerId) conditionValue.conditionValue = value;
    return conditionValue;
  });
  catchAnswer(medicalCase, nodeId);
  // TODO UPDATE CHILDREN
};

  const nodeAction = (medicalCase, nodeId, callerId, callerType) => {
  let caller;

  if (callerType === nodeTypes.diagnostic) caller = medicalCase.diagnostics[callerId];
  else if (callerType !== nodeTypes.diagnostic) caller = medicalCase.nodes[callerId];

  // What do we do with this child -> switch according to type
  switch (caller.type) {
    case nodeTypes.question:
    case nodeTypes.questionsSequence:
      condition(medicalCase, nodeId, caller.id);
      break;
    case nodeTypes.finalDiagnostic:
      return of(dispatchFinalDiagnosticAction(nodeId, caller.id));
    case nodeTypes.healthCare:
      // TODO: to implement
      break;
    case nodeTypes.diagnostic:
      // Check children of the node in the current diagnostic and process them as well.
      caller.instances[nodeId].children.map((childId) => {
        nodeAction(medicalCase, caller.id, childId, medicalCase.nodes[childId].type);
      });
      break;
    default:
      // eslint-disable-next-line no-console
      if (__DEV__) {
        console.log('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', 'nodes type ', caller.type, 'doesn\'t exist');
      }
  }
};

const questionsSequenceAction = (medicalCase, questionsSequenceId) => {
  const currentQuestionsSequence = medicalCase.nodes[questionsSequenceId];
  let answerId = null;
  let statusQs;
  let questionsSequenceCondition = null;

  /** Return the status of the QS
   *  true = can reach the end
   *  null = Still possible but not yet
   *  false = can't access the end anymore
   */
  statusQs = getQuestionsSequenceStatus(medicalCase, currentQuestionsSequence, actions);

  // If ready we calculate condition of the QS
  if (statusQs) {
    questionsSequenceCondition = currentQuestionsSequence.calculateCondition();
  }

  if (questionsSequenceCondition === true) {
    answerId = currentQuestionsSequence.answers[Object.keys(currentQuestionsSequence.answers).first()].id;
  } else if (questionsSequenceCondition === false || statusQs === false) {
    // statusQd === false -> can't access the end of the QS anymore
    // questionsSequenceCondition === false -> can't find a condition to true
    answerId = currentQuestionsSequence.answers[Object.keys(currentQuestionsSequence.answers).second()].id;
  }

  // If the new answer of this QS is different from the older, we change it
  if (answerId !== currentQuestionsSequence.answer) {
    medicalCase.nodes[currentQuestionsSequence.id].updateAnswer(answerId);
    medicalCase.nodes = new NodesModel(medicalCase.nodes);
    catchAnswer(medicalCase, currentQuestionsSequence.id);
    // TODO UPDATE CHILDREN
  }
};

const condition = (medicalCase, diagnosticId, nodeId) => {
  const diagnostic = medicalCase.diagnostics[diagnosticId];
  const { nodes } = medicalCase;
  const currentInstance = diagnostic.instances[nodeId];
  const currentNode = nodes[nodeId];
  const parentsNodes = getParentsNodes(medicalCase, diagnosticId, nodeId);
  const currentConditionValue = find(nodes[currentInstance.id].dd, (d) => d.id === diagnosticId);

  // If the complaint category linked to the diagnostic is not selected we set the condition value to false
  if (diagnostic.isExcludedByComplaintCategory(nodes)) {
    if (currentConditionValue.conditionValue !== false) {
      updateConditionValue(medicalCase, nodeId, diagnosticId, false, diagnostic.type);
    }
  } else {
    // some() – returns true if the function returns true for at least one of the items
    // If one parentsNodes has to be show and answered
    let parentConditionValue = true;
    if (parentsNodes.length > 0) {
      parentConditionValue = parentsNodes.some((i) => {
        const parentNode = nodes[i];
        const diagnostic = find(parentNode.dd, (nodeDiagnostic) => nodeDiagnostic.id === diagnosticId);
        return parentNode.answer !== null && diagnostic.conditionValue === true;
      });
    }

    // Get node condition value
    const conditionValue = currentInstance.calculateCondition();
    // If the condition of this node is not null
    if (parentConditionValue === false) {
      // Stop infinite loop, change only when conditionValue is different
      if (currentConditionValue.conditionValue !== false) {
        // Set parent to false if their condition's isn't correct. Used to stop the algorithm
        updateConditionValue(medicalCase, nodeId, diagnosticId, false, diagnostic.type);
      }
    } else if (conditionValue !== null) {
      // Stop infinite loop, change only whene conditionValue is different
      if (currentConditionValue.conditionValue !== conditionValue) {
        updateConditionValue(medicalCase, nodeId, diagnosticId, conditionValue, diagnostic.type);
      }

      // If the node is answered go his children
      if (currentNode.answer !== null) {
        nodeAction(medicalCase, nodeId, diagnosticId, nodeTypes.diagnostic);
      }
    }
  }
};

const updateRelatedNode = (medicalCase, nodeId) => {
  const currentNode = medicalCase.nodes[nodeId];
  let value = null;

  switch (currentNode.display_format) {
    case displayFormats.formula:
      value = currentNode.calculateFormula();
      break;
    case displayFormats.reference:
      value = currentNode.calculateReference();
      break;
  }

  if (value !== currentNode.value) {
    medicalCase.nodes[currentNode.id].updateAnswer(value);
    catchAnswer(medicalCase, currentNode.id);
    // TODO UPDATE CHILDREN
  }
};

const catchAnswer = (medicalCase, index) => {
  const currentNode = medicalCase.nodes[index];
  const relatedDiagnostics = currentNode.dd;
  const relatedQuestionsSequence = currentNode.qs;
  const relatedDiagnosticsForCC = currentNode.diagnostics_related_to_cc;
  const relatedNodes = currentNode.referenced_in;

  if (__DEV__) {
    console.log('%c ########################  epicCatchAnswer ########################', 'background: #F6F3EE; color: #b84c4c; padding: 5px');
  }

  // Inject update
  medicalCase.updated_at = moment().format();

  // If it's birth date node, check eligibility age and update it in medical case
  if (index === medicalCase.config.basic_questions.birth_date_question_id) {
    const birthDate = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_question_id].value;
    const years = birthDate !== null ? moment().diff(birthDate, 'years') : 0;
    medicalCase.isEligible = years < medicalCase.config.age_limit;
  }
  // For each related diagnoses we gonna check if we need to update their status
  relatedDiagnostics.forEach((diagnostic) => nodeAction(medicalCase, currentNode.id, diagnostic.id, nodeTypes.diagnostic));

  // For each related questionSequence we gonna check if we need to update their status
  relatedQuestionsSequence.forEach((questionsSequence) => questionsSequenceAction(medicalCase, questionsSequence.id));

  // If the node is a QuestionSequence we gonna update the status of all the instances of the questions sequence
  if (currentNode.type === nodeTypes.questionsSequence) {
    questionsSequenceAction(medicalCase, currentNode.id);
  }

  if (relatedDiagnosticsForCC !== undefined) {
    relatedDiagnosticsForCC.forEach((diagnosticId) => {
      const { instances } = medicalCase.diagnostics[diagnosticId];
      Object.keys(instances).forEach((nodeId) => {
        if (instances[nodeId].top_conditions.length === 0) {
          condition(medicalCase, diagnosticId, nodeId);
        }
      });
    });
  }

  // We tell the related nodes to update themself
  if (currentNode.type === nodeTypes.question) {
    relatedNodes.forEach((relatedNodeId) => updateRelatedNode(medicalCase, relatedNodeId));
  }

  if (index === medicalCase.mobile_config.left_top_question_id || index === medicalCase.mobile_config.first_top_right_question_id || index === medicalCase.mobile_config.second_top_right_question_id) {
    NavigationService.setParamsAge();
  }
};

/**
 * Loop on diagnostics AND QS
 *
 * @params [Object] action$, [Object] state$
 * @return [Array][Object] arrayActions
 * */
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_ANSWER, actions.SET_ANSWER_TO_UNAVAILABLE, actions.UPDATE_CONDITION_VALUE),
    mergeMap((action) => {
      // Index is the id of the node that has just been answered
      const { index } = action.payload;

      const medicalCase = MedicalCaseModel.copyMedicalCase(state$.value);

      catchAnswer(medicalCase, index);

      return of(setMedicalCase(medicalCase), asyncScheduler);
    })
  );

// /**
//  * Process the impacted node according to his type
//  *
//  * @params [Object] action$, [Object] state$
//  * @return [Array][Object] arrayActions
//  * */
// export const epicCatchDispatchNodeAction = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.HANDLE_NODE_CHANGED),
//     mergeMap((action) => {})
//   );

// /**
//  * Trigger when there is a change in a QS
//  */
// export const epicCatchQuestionsSequenceAction = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.DISPATCH_QUESTIONS_SEQUENCE_ACTION),
//     mergeMap((action) => {
//
//     })
//   );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process final diagnostic by checking his conditions then process its health cares
// export const epicCatchFinalDiagnosticAction = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.DISPATCH_FINAL_DIAGNOSTIC_ACTION),
//     mergeMap((action) => {
//       const actions = [];
//       const { diagnosticId, finalDiagnosticId } = action.payload;
//       const finalDiagnostic = state$.value.nodes[finalDiagnosticId];
//
//       // Get the conditions of the node
//       const condition = finalDiagnostic.calculateCondition();
//
//       // Depending the result of the condition
//       switch (condition) {
//         case true:
//           // If he was already in the additional section
//           if (state$.value.diagnoses.proposed[finalDiagnosticId] === undefined) {
//             // Add it on proposed
//             actions.push(
//               setDiagnoses('proposed', {
//                 ...finalDiagnostic,
//                 agreed: null,
//               })
//             );
//           }
//
//           // Remove from additional if moved to proposed (no duplicata)
//           if (state$.value.diagnoses.additional[finalDiagnosticId] !== undefined) {
//             actions.push(setDiagnoses('additional', finalDiagnostic, 'remove'));
//           }
//
//           break;
//         case false:
//           if (state$.value.diagnoses.proposed[finalDiagnosticId] !== undefined) {
//             // Remove it from proposed
//             actions.push(setDiagnoses('proposed', finalDiagnostic, 'remove'));
//           }
//
//           break;
//         case null:
//       }
//
//       // Check the condition of the children
//       return of(...actions);
//     })
//   );

// export const epicCatchDispatchFormulaNodeAction = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.DISPATCH_RELATED_NODE_ACTION),
//     mergeMap((action) => {
//
//     })
//   );

// /**
//  * Dispatch condition action on condition result
//  * @param action$
//  * @param state$
//  * @returns {*} [Array][Object] arrayActions
//  */
// export const epicCatchDispatchCondition = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.DISPATCH_CONDITION),
//     mergeMap((action) => {})
//   );

export default combineEpics(
  // epicCatchDispatchFormulaNodeAction,
  // epicCatchQuestionsSequenceAction,
  epicCatchAnswer
  // epicCatchFinalDiagnosticAction,
  // epicCatchDispatchNodeAction,
  // epicCatchDispatchCondition
);
