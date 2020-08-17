/* eslint-disable no-param-reassign */
import { combineEpics, ofType } from 'redux-observable';
import find from 'lodash/find';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import moment from 'moment';
import { actions } from '../actions/types.actions';
import { displayFormats, nodeTypes } from '../constants';
import { dispatchFinalDiagnosticAction, setMedicalCase } from '../actions/creators.actions';
import { getParentsNodes, getQuestionsSequenceStatus } from './treeDiagnosis.algo';
import NavigationService from '../../src/engine/navigation/Navigation.service';
import { NodesModel } from '../engine/models/Nodes.model';

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
  // caller.map((conditionValue) => {
  //   if (conditionValue.id === callerId) conditionValue.conditionValue = value;
  //   return conditionValue;
  // });
  catchAnswer(medicalCase, nodeId);
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
    questionsSequenceCondition = currentQuestionsSequence.calculateCondition(medicalCase);
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
    catchAnswer(medicalCase, currentQuestionsSequence.id);
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
    const conditionValue = currentInstance.calculateCondition(medicalCase);
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

const updateReferencedNode = (medicalCase, nodeId) => {
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
  }
};

const catchAnswer = (medicalCase, nodeId) => {
  const currentNode = medicalCase.nodes[nodeId];
  const relatedDiagnostics = currentNode.dd;
  const relatedQuestionsSequence = currentNode.qs;
  const relatedDiagnosticsForCC = currentNode.diagnostics_related_to_cc;
  const referencedNodes = currentNode.referenced_in;

  if (__DEV__) {
    console.log('%c ########################  epicCatchAnswer ########################', 'background: #F6F3EE; color: #b84c4c; padding: 5px');
  }

  // Inject update
  medicalCase.updated_at = moment().format();

  // If it's birth date node, check eligibility age and update it in medical case
  if (nodeId === medicalCase.config.basic_questions.birth_date_question_id) {
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

  // We tell the related nodes to update themself
  if (currentNode.type === nodeTypes.question) {
    referencedNodes.forEach((referencedNodeId) => updateReferencedNode(medicalCase, referencedNodeId));
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
};

/**
 * Loop on diagnostics AND QS
 *
 * @params [Object] action$, [Object] state$
 * @return [Array][Object] arrayActions
 * */
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_ANSWER, actions.SET_ANSWER_TO_UNAVAILABLE),
    mergeMap((action) => {
      // Index is the id of the node that has just been answered
      const { nodeId } = action.payload;

      const medicalCase = {
        ...state$.value,
        nodes: new NodesModel(JSON.parse(JSON.stringify(state$.value.nodes))),
      };
      catchAnswer(medicalCase, nodeId);

      if (
        nodeId === medicalCase.mobile_config.left_top_question_id ||
        nodeId === medicalCase.mobile_config.first_top_right_question_id ||
        nodeId === medicalCase.mobile_config.second_top_right_question_id
      ) {
        NavigationService.setParamsAge();
      }

      return of(setMedicalCase(medicalCase));
    })
  );

export default combineEpics(epicCatchAnswer);
