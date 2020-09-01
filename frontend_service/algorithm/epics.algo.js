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

/**
 * Computes the value of the conditionValue for the given parameters, and updates it if necessary
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } diagnosticId - The id of diagnostic related
 * @param { integer } nodeId - The id of node related
 */
const computeConditionValue = (medicalCase, diagnosticId, nodeId) => {
  const diagnostic = medicalCase.diagnostics[diagnosticId];
  const { nodes } = medicalCase;
  const currentInstance = diagnostic.instances[nodeId];
  const currentNode = nodes[nodeId];
  const parentsNodes = getParentsNodes(medicalCase, diagnosticId, nodeId);

  // If the complaint category linked to the diagnostic is not selected we set the condition value to false
  if (diagnostic.isExcludedByComplaintCategory(nodes)) {
    updateConditionValue(medicalCase, nodeId, diagnosticId, false, diagnostic.type);
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
      // Set parent to false if their condition's isn't correct. Used to stop the algorithm
      updateConditionValue(medicalCase, nodeId, diagnosticId, false, diagnostic.type);
    } else if (conditionValue !== null) {
      // Stop infinite loop, change only when conditionValue is different
      updateConditionValue(medicalCase, nodeId, diagnosticId, conditionValue, diagnostic.type);

      // If the node is answered go his children
      if (currentNode.answer !== null) {
        nodeAction(medicalCase, nodeId, diagnosticId, nodeTypes.diagnostic);
      }
    }
  }
};

/**
 * Sets the new condition value of the caller, updates the counters et triggers the processUpdatedNode function.
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 * @param { integer } callerId - the id of the caller
 * @param { boolean } value - the new value of the condition Value
 * @param { string } type - The type of the caller can be either diagnostic or questionsSequence
 */
export const updateConditionValue = (medicalCase, nodeId, callerId, value, type) => {
  let caller;

  // We get the caller based on type and id
  switch (type) {
    case nodeTypes.diagnostic:
      caller = medicalCase.nodes[nodeId].dd;
      break;
    case nodeTypes.questionsSequence:
      caller = medicalCase.nodes[nodeId].qs;
      break;
  }

  caller = find(caller, (d) => d.id === callerId);

  // We update only if the condition changes
  if (caller.conditionValue !== value) {
    // Update counter conditionValue
    if (value === true) {
      medicalCase.nodes[nodeId].counter += 1;
    } else if (value === false) {
      medicalCase.nodes[nodeId].counter -= 1;
    }
    caller.conditionValue = value;

    processUpdatedNode(medicalCase, nodeId);
  }
};

/**
 * Based on the type of the caller's type, we process the nodes changes
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 * @param { integer } callerId - the id of the caller
 * @param { string } callerType - The type of the caller can be either diagnostic or questionsSequence
 */
const nodeAction = (medicalCase, nodeId, callerId, callerType) => {
  let caller;

  if (callerType === nodeTypes.diagnostic) caller = medicalCase.diagnostics[callerId];
  else if (callerType !== nodeTypes.diagnostic) caller = medicalCase.nodes[callerId];

  // What do we do with this child -> switch according to type
  switch (caller.type) {
    case nodeTypes.question:
    case nodeTypes.questionsSequence:
      computeConditionValue(medicalCase, nodeId, caller.id);
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

/**
 * We process the changes in the question Sequence
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } questionsSequenceId - The id of Question sequence related
 */
const questionsSequenceAction = (medicalCase, questionsSequenceId) => {
  const currentQuestionsSequence = medicalCase.nodes[questionsSequenceId];
  let answerId = null;
  let questionsSequenceCondition = null;
  /**
   *  Return the status of the QS
   *  true = can reach the end
   *  null = Still possible but not yet
   *  false = can't access the end anymore
   */
  const statusQs = getQuestionsSequenceStatus(medicalCase, currentQuestionsSequence, actions);

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
    processUpdatedNode(medicalCase, currentQuestionsSequence.id);
  }
};

/**
 * The function is called for all the references table and formulas related to a node, it allows to calculate their
 * value based on the new value of the node.
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 */
const referencedNodeAction = (medicalCase, nodeId) => {
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
    processUpdatedNode(medicalCase, currentNode.id);
  }
};

/**
 * Whenever the status of a nodes changes (answer, condition value), we call this function. It will trigger all the
 * function needed to update the state of the medical case.
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 */
const processUpdatedNode = (medicalCase, nodeId) => {
  const currentNode = medicalCase.nodes[nodeId];
  const relatedDiagnostics = currentNode.dd;
  const relatedQuestionsSequence = currentNode.qs;
  const relatedDiagnosticsForCC = currentNode.diagnostics_related_to_cc;
  const referencedNodes = currentNode.referenced_in;

  if (__DEV__) {
    console.log('%c ########################  epicSetAnswer ########################', 'background: #F6F3EE; color: #b84c4c; padding: 5px');
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
    referencedNodes.forEach((referencedNodeId) => referencedNodeAction(medicalCase, referencedNodeId));
  }

  if (relatedDiagnosticsForCC !== undefined) {
    relatedDiagnosticsForCC.forEach((diagnosticId) => {
      const { instances } = medicalCase.diagnostics[diagnosticId];
      Object.keys(instances).forEach((nodeId) => {
        if (instances[nodeId].top_conditions.length === 0) {
          computeConditionValue(medicalCase, diagnosticId, nodeId);
        }
      });
    });
  }
};

/**
 * Catches the action SET_ANSWER so whenever a question is answered by the user this function will be triggered
 */
export const epicSetAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_ANSWER, actions.SET_ANSWER_TO_UNAVAILABLE),
    mergeMap((action) => {
      const { nodeId } = action.payload;
      const medicalCase = {
        ...state$.value,
        nodes: new NodesModel(JSON.parse(JSON.stringify(state$.value.nodes))),
      };

      processUpdatedNode(medicalCase, nodeId);

      // TODO: Error on dispatch in NavigationService. Have not found a solution to mock it
      if (
        (nodeId === medicalCase.mobile_config.left_top_question_id ||
        nodeId === medicalCase.mobile_config.first_top_right_question_id ||
        nodeId === medicalCase.mobile_config.second_top_right_question_id) && process.env.node_ENV !== 'test'
      ) {
        NavigationService.setParamsAge();
      }

      return of(setMedicalCase(medicalCase));
    })
  );

export default combineEpics(epicSetAnswer);
