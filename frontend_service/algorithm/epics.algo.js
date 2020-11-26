/* eslint-disable no-param-reassign */
import { combineEpics, ofType } from 'redux-observable';
import find from 'lodash/find';
import { mergeMap } from 'rxjs/operators';
import moment from 'moment';
import { EMPTY, of } from 'rxjs';
import { actions } from '../actions/types.actions';
import { displayFormats, nodeTypes } from '../constants';
import { dispatchFinalDiagnosticAction, setMedicalCase } from '../actions/creators.actions';
import { getParentsNodes, getQuestionsSequenceStatus } from './treeDiagnosis.algo';
import { finalDiagnosticAgreed } from '../helpers/FinalDiagnostic.model';
import NavigationService from '../../src/engine/navigation/Navigation.service';
import { calculateCondition } from './conditionsHelpers.algo';
import { diagnosticIsExcludedByComplaintCategory } from '../helpers/Diagnostic.model';
import { questionCalculateFormula, questionCalculateReference } from '../helpers/Question.model';
import { questionSequenceCalculateCondition } from '../helpers/QuestionsSequenceModel';
import { nodeUpdateAnswer } from '../helpers/Node.model';

/**
 * Computes the value of the conditionValue for the given parameters, and updates it if necessary
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } diagnosticId - The id of diagnostic related
 * @param { integer } nodeId - The id of node related
 */
const computeConditionValue = (algorithm, medicalCase, diagnosticId, nodeId) => {
  const diagnostic = algorithm.diagnostics[diagnosticId];
  const { nodes } = medicalCase;
  const currentInstance = diagnostic.instances[nodeId];
  const currentNode = nodes[nodeId];
  const parentsNodes = getParentsNodes(algorithm, diagnosticId, nodeId);

  // If the complaint category linked to the diagnostic is not selected we set the condition value to false
  if (diagnosticIsExcludedByComplaintCategory(algorithm, diagnosticId, medicalCase)) {
    updateConditionValue(algorithm, medicalCase, nodeId, diagnosticId, false, nodeTypes.diagnostic);
  } else {
    // some() – returns true if the function returns true for at least one of the items
    // If one parentsNodes has to be show and answered
    let parentConditionValue = true;
    if (parentsNodes.length > 0) {
      parentConditionValue = parentsNodes.some((i) => {
        const parentNode = nodes[i];
        const diagnostic = find(parentNode.dd, (nodeDiagnostic) => nodeDiagnostic.id === diagnosticId);

        // Check if answer given by parent node is the same requested by current node tested
        const parentHasCorrectAnswer = algorithm.diagnostics[diagnosticId].instances[nodeId].top_conditions.some((condition) => {
          if (condition.first_node_id === parentNode.id) {
            return parentNode.answer === condition.first_id;
          }
        });
        return parentNode.answer !== null && diagnostic.conditionValue === true && parentHasCorrectAnswer;
      });
    }

    // Get node condition value
    const conditionValue = calculateCondition(algorithm, currentInstance, medicalCase);
    // If the condition of this node is not null
    if (parentConditionValue === false) {
      // Set parent to false if their condition's isn't correct. Used to stop the algorithm
      updateConditionValue(algorithm, medicalCase, nodeId, diagnosticId, false, nodeTypes.diagnostic);
    } else if (conditionValue !== null) {
      updateConditionValue(algorithm, medicalCase, nodeId, diagnosticId, conditionValue, nodeTypes.diagnostic);

      // If the node is answered go his children
      if (currentNode.answer !== null) {
        nodeAction(algorithm, medicalCase, nodeId, diagnosticId, nodeTypes.diagnostic);
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
export const updateConditionValue = (algorithm, medicalCase, nodeId, callerId, value, type) => {
  let caller;
  let index;
  let key;

  // We get the caller based on type and id
  switch (type) {
    case nodeTypes.diagnostic:
      caller = medicalCase.nodes[nodeId].dd;
      key = 'dd';
      break;
    case nodeTypes.questionsSequence:
      caller = medicalCase.nodes[nodeId].qs;
      key = 'qs';
      break;
  }

  caller = find(caller, (d) => d.id === callerId);

  // We update only if the condition changes
  if (caller.conditionValue !== value) {
    index = medicalCase.nodes[nodeId][key].findIndex((d) => d.id === callerId);
    // Update counter conditionValue
    if (value === true) {
      medicalCase.nodes[nodeId].counter += 1;
    } else if (value === false) {
      medicalCase.nodes[nodeId].counter -= 1;
    }
    medicalCase.nodes[nodeId][key][index].conditionValue = value;

    processUpdatedNode(algorithm, medicalCase, nodeId);
  }
};

/**
 * Based on the type of the caller's type, we process the nodes changes
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 * @param { integer } callerId - the id of the caller
 * @param { string } callerType - The type of the caller can be either diagnostic or questionsSequence
 */
const nodeAction = (algorithm, medicalCase, nodeId, callerId, callerType) => {
  if (callerType === nodeTypes.diagnostic) {
    const diagnostic = algorithm.diagnostics[callerId];
    diagnostic.instances[nodeId].children.map((childId) => {
      nodeAction(algorithm, medicalCase, diagnostic.id, childId, medicalCase.nodes[childId].type);
    });
  } else {
    const mcNode = medicalCase.nodes[callerId];
    switch (mcNode.type) {
      case nodeTypes.question:
      case nodeTypes.questionsSequence:
        computeConditionValue(algorithm, medicalCase, nodeId, mcNode.id);
        break;
      case nodeTypes.healthCare:
        break;
      case nodeTypes.finalDiagnostic:
        return of(dispatchFinalDiagnosticAction(nodeId, mcNode.id));
      default:
        if (__DEV__) {
          console.log('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', 'nodes type ', mcNode.type, 'doesn\'t exist');
        }
    }
  }
};

/**
 * We process the changes in the question Sequence
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } questionsSequenceId - The id of Question sequence related
 */
const questionsSequenceAction = (algorithm, medicalCase, questionsSequenceId) => {
  const currentQuestionsSequence = algorithm.nodes[questionsSequenceId];
  let answerId = null;
  let questionsSequenceCondition = null;
  /**
   *  Return the status of the QS
   *  true = can reach the end
   *  null = Still possible but not yet
   *  false = can't access the end anymore
   */
  const statusQs = getQuestionsSequenceStatus(algorithm, medicalCase, currentQuestionsSequence);
  // If ready we calculate condition of the QS
  if (statusQs) {
    questionsSequenceCondition = questionSequenceCalculateCondition(algorithm, medicalCase, currentQuestionsSequence);
  }

  if (questionsSequenceCondition === true) {
    answerId = currentQuestionsSequence.answers[Object.keys(currentQuestionsSequence.answers)[0]].id;
  } else if (questionsSequenceCondition === false || statusQs === false) {
    // statusQd === false -> can't access the end of the QS anymore
    // questionsSequenceCondition === false -> can't find a condition to true
    answerId = currentQuestionsSequence.answers[Object.keys(currentQuestionsSequence.answers)[1]].id;
  }

  // If the new answer of this QS is different from the older, we change it
  if (answerId !== medicalCase.nodes[currentQuestionsSequence.id].answer) {
    medicalCase.nodes[currentQuestionsSequence.id] = {
      ...medicalCase.nodes[currentQuestionsSequence.id],
      ...nodeUpdateAnswer(answerId, algorithm, medicalCase.nodes[currentQuestionsSequence.id]),
    };
    processUpdatedNode(algorithm, medicalCase, currentQuestionsSequence.id);
  }
};

/**
 * The function is called for all the references table and formulas related to a node, it allows to calculate their
 * value based on the new value of the node.
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 */
const referencedNodeAction = (algorithm, medicalCase, nodeId) => {
  const currentNode = algorithm.nodes[nodeId];
  const mcNode = medicalCase.nodes[nodeId];
  let value = null;

  switch (currentNode.display_format) {
    case displayFormats.formula:
      value = questionCalculateFormula(algorithm, medicalCase, currentNode);
      break;
    case displayFormats.reference:
      value = questionCalculateReference(algorithm, medicalCase, currentNode);
      break;
  }
  if (value !== mcNode.value) {
    medicalCase.nodes[currentNode.id] = {
      ...medicalCase.nodes[currentNode.id],
      ...nodeUpdateAnswer(value, algorithm, medicalCase.nodes[currentNode.id]),
    };
    processUpdatedNode(algorithm, medicalCase, currentNode.id);
  }
};

/**
 * Whenever the status of a nodes changes (answer, condition value), we call this function. It will trigger all the
 * function needed to update the state of the medical case.
 * @param { object } medicalCase - The current state of the medical case
 * @param { integer } nodeId - The id of node related
 */
const processUpdatedNode = (algorithm, medicalCase, nodeId) => {
  const mcNode = medicalCase.nodes[nodeId];
  const currentNode = algorithm.nodes[nodeId];
  const relatedDiagnostics = mcNode.dd;
  const relatedQuestionsSequence = mcNode.qs;
  const relatedDiagnosticsForCC = currentNode.diagnostics_related_to_cc;

  // Inject update
  medicalCase.updated_at = moment().format();

  // If it's birth date node, check eligibility age and update it in medical case
  if (nodeId === algorithm.config.basic_questions.birth_date_question_id) {
    const birthDate = medicalCase.nodes[algorithm.config.basic_questions.birth_date_question_id].value;
    const years = birthDate !== null ? moment().diff(birthDate, 'years') : 0;
    medicalCase.isEligible = years < algorithm.config.age_limit;
  }

  // For each related diagnoses we gonna check if we need to update their status
  relatedDiagnostics.forEach((diagnostic) => nodeAction(algorithm, medicalCase, mcNode.id, diagnostic.id, nodeTypes.diagnostic));

  // For each related questionSequence we gonna check if we need to update their status
  relatedQuestionsSequence.forEach((questionsSequence) => questionsSequenceAction(algorithm, medicalCase, questionsSequence.id));

  // If the node is a QuestionSequence we gonna update the status of all the instances of the questions sequence
  if (mcNode.type === nodeTypes.questionsSequence) {
    questionsSequenceAction(algorithm, medicalCase, mcNode.id);
  }

  // We tell the related nodes to update themself
  if (mcNode.type === nodeTypes.question) {
    currentNode.referenced_in.forEach((referencedNodeId) => referencedNodeAction(algorithm, medicalCase, referencedNodeId));
  }

  if (relatedDiagnosticsForCC !== undefined) {
    relatedDiagnosticsForCC.forEach((diagnosticId) => {
      const { instances } = algorithm.diagnostics[diagnosticId];
      Object.keys(instances).forEach((nodeId) => {
        if (instances[nodeId].top_conditions.length === 0) {
          computeConditionValue(algorithm, medicalCase, diagnosticId, nodeId);
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
      const { nodeId, algorithm } = action.payload;
      const medicalCase = state$.value;
      processUpdatedNode(algorithm, medicalCase, nodeId);

      // TODO: Error on dispatch in NavigationService. Have not found a solution to mock it
      if (
        (nodeId === algorithm.mobile_config.left_top_question_id ||
          nodeId === algorithm.mobile_config.first_top_right_question_id ||
          nodeId === algorithm.mobile_config.second_top_right_question_id) &&
        process.env.node_ENV !== 'test'
      ) {
        NavigationService.setParamsAge(algorithm);
      }

      return of(setMedicalCase(medicalCase));
    })
  );

export const epicSetDiagnoses = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_DIAGNOSES, actions.SET_ANSWER),
    mergeMap((action) => {
      const finalDiagnostics = finalDiagnosticAgreed(state$.value);

      if (finalDiagnostics.length > 0) {
        const { algorithm } = action.payload;

        const medicalCase = state$.value;

        finalDiagnostics.forEach((finalDiagnosticId) => {
          const finalDiagnostic = medicalCase.nodes[finalDiagnosticId];
          Object.keys(finalDiagnostic.instances).forEach((healthCaresQuestionId) => {
            const healthCaresQuestion = finalDiagnostic.instances[healthCaresQuestionId];
            const dfInstance = medicalCase.nodes[healthCaresQuestion.id].df.find((df) => df.id === finalDiagnosticId);
            dfInstance.conditionValue = calculateCondition(algorithm, healthCaresQuestion, medicalCase);
          });
        });

        return of(setMedicalCase(medicalCase));
      }
      return EMPTY;
    })
  );

export default combineEpics(epicSetAnswer, epicSetDiagnoses);
