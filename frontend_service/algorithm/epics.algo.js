import { combineEpics, ofType } from 'redux-observable';
import find from 'lodash/find';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import moment from 'moment';
import { actions } from '../actions/types.actions';
import { displayFormats, nodeTypes } from '../constants';
import {
  updateConditionValue,
  dispatchFinalDiagnosticAction,
  dispatchCondition,
  dispatchNodeAction,
  dispatchQuestionsSequenceAction,
  setAnswer,
  dispatchRelatedNodeAction,
  updateMedicalCaseProperty,
  setDiagnoses,
} from '../actions/creators.actions';
import { getParentsNodes, getQuestionsSequenceStatus } from './treeDiagnosis.algo';
import NavigationService from '../../src/engine/navigation/Navigation.service';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state is updated. */

/**
 * Loop on diagnostics AND QS
 *
 * @params [Object] action$, [Object] state$
 * @return [Array][Object] arrayActions
 * */
// TODO make PS change side effect
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_ANSWER, actions.SET_ANSWER_TO_UNAVAILABLE, actions.UPDATE_CONDITION_VALUE),
    switchMap((action) => {
      // Index is the id of the node that has just been answered
      const { index } = action.payload;

      if (__DEV__) {
        console.log('%c ########################  epicCatchAnswer ########################', 'background: #F6F3EE; color: #b84c4c; padding: 5px');
      }

      const currentNode = state$.value.nodes[index];
      const relatedDiagnostics = currentNode.dd;
      const relatedQuestionsSequence = currentNode.qs;
      const relatedDiagnosticsForCC = currentNode.diagnostics_related_to_cc;
      const relatedNodes = currentNode.referenced_in;

      const arrayActions = [];

      // Inject update
      arrayActions.push(updateMedicalCaseProperty('updated_at', moment().format()));

      // If it's birth date node, check eligibility age and update it in medical case
      if (index === state$.value.config.basic_questions.birth_date_question_id) {
        const birthDate = state$.value.nodes[state$.value.config.basic_questions.birth_date_question_id].value;
        const years = birthDate !== null ? moment().diff(birthDate, 'years') : 0;
        arrayActions.push(updateMedicalCaseProperty('isEligible', years < state$.value.config.age_limit));
      }

      // For each related diagnoses we gonna check if we need to update their status
      relatedDiagnostics.map((diagnostic) => arrayActions.push(dispatchNodeAction(index, diagnostic.id, nodeTypes.diagnostic)));

      // For each related questionSequence we gonna check if we need to update their status
      relatedQuestionsSequence.map((questionsSequence) => arrayActions.push(dispatchQuestionsSequenceAction(questionsSequence.id, index)));

      // If the node is a QuestionSequence we gonna update the status of all the instances of the questions sequence
      if (currentNode.type === nodeTypes.questionsSequence){
        Object.keys(currentNode.instances).map((nodeId) => {
          arrayActions.push(dispatchQuestionsSequenceAction(currentNode.id, nodeId));
        });
      }

      if (relatedDiagnosticsForCC !== undefined) {
        relatedDiagnosticsForCC.map((diagnosticId) => {
          const { instances } = state$.value.diagnostics[diagnosticId];
          Object.keys(instances).map((nodeId) => {
            if (instances[nodeId].top_conditions.length === 0) {
              arrayActions.push(dispatchCondition(diagnosticId, nodeId));
            }
          });
        });
      }

      // We tell the related nodes to update themself
      if (currentNode.type === nodeTypes.question) {
        relatedNodes.map((relatedNodeId) => arrayActions.push(dispatchRelatedNodeAction(relatedNodeId)));
      }

      if (
        index === state$.value.mobile_config.left_top_question_id ||
        index === state$.value.mobile_config.first_top_right_question_id ||
        index === state$.value.mobile_config.second_top_right_question_id
      ) {
        NavigationService.setParamsAge();
      }

      return of(...arrayActions);
    })
  );

/**
 * Process the impacted node according to his type
 *
 * @params [Object] action$, [Object] state$
 * @return [Array][Object] arrayActions
 * */
export const epicCatchDispatchNodeAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.HANDLE_NODE_CHANGED),
    switchMap((action) => {
      const arrayActions = [];
      let caller;

      const { nodeId, callerId, callerType } = action.payload;

      if (callerType === nodeTypes.diagnostic) caller = state$.value.diagnostics[callerId];
      else if (callerType !== nodeTypes.diagnostic) caller = state$.value.nodes[callerId];

      let nodeChildren;

      // What do we do with this child -> switch according to type
      switch (caller.type) {
        case nodeTypes.question:
        case nodeTypes.questionsSequence:
          return of(dispatchCondition(nodeId, caller.id));
        case nodeTypes.finalDiagnostic:
          return of(dispatchFinalDiagnosticAction(nodeId, caller.id));
        case nodeTypes.healthCare:
          // TODO: to implement
          return [];
        case nodeTypes.diagnostic:
          // Get children of the node in the current diagnostic
          nodeChildren = caller.instances[nodeId].children;
          // Check children of the node in the current diagnostic and process them as well.
          nodeChildren.map((childId) => {
            arrayActions.push(dispatchNodeAction(caller.id, childId, state$.value.nodes[childId].type));
          });

          return of(...arrayActions);
        default:
          // eslint-disable-next-line no-console
          if (__DEV__) {
            console.log('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', 'nodes type ', caller.type, 'doesn\'t exist');
          }
          return [];
      }
    })
  );

/**
 * Trigger when there is a change in a QS
 */
export const epicCatchQuestionsSequenceAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_QUESTIONS_SEQUENCE_ACTION),
    switchMap((action) => {
      const { questionsSequenceId } = action.payload;
      const currentQuestionsSequence = state$.value.nodes[questionsSequenceId];
      let answerId = null;
      const actions = [];
      let statusQs;
      let questionsSequenceCondition = null;

      /** Return the status of the QS
       *  true = can reach the end
       *  null = Still possible but not yet
       *  false = can't access the end anymore
       */
      statusQs = getQuestionsSequenceStatus(state$, currentQuestionsSequence, actions);

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
        actions.push(setAnswer(currentQuestionsSequence.id, answerId));
      }
      return of(...actions);
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process final diagnostic by checking his conditions then process its health cares
export const epicCatchFinalDiagnosticAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_FINAL_DIAGNOSTIC_ACTION),
    switchMap((action) => {
      const actions = [];
      const { diagnosticId, finalDiagnosticId } = action.payload;
      const finalDiagnostic = state$.value.nodes[finalDiagnosticId];

      // Get the conditions of the node
      const condition = finalDiagnostic.calculateCondition();

      // Depending the result of the condition
      switch (condition) {
        case true:
          // If he was already in the additional section
          if (state$.value.diagnoses.proposed[finalDiagnosticId] === undefined) {
            // Add it on proposed
            actions.push(
              setDiagnoses('proposed', {
                ...finalDiagnostic,
                agreed: null,
              })
            );
          }

          // Remove from additional if moved to proposed (no duplicata)
          if (state$.value.diagnoses.additional[finalDiagnosticId] !== undefined) {
            actions.push(setDiagnoses('additional', finalDiagnostic, 'remove'));
          }

          break;
        case false:
          if (state$.value.diagnoses.proposed[finalDiagnosticId] !== undefined) {
            // Remove it from proposed
            actions.push(setDiagnoses('proposed', finalDiagnostic, 'remove'));
          }

          break;
        case null:
      }

      // Check the condition of the children
      return of(...actions);
    })
  );

export const epicCatchDispatchFormulaNodeAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_RELATED_NODE_ACTION),
    switchMap((action) => {
      const { nodeId } = action.payload;
      const currentNode = state$.value.nodes[nodeId];
      const actions = [];
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
        actions.push(setAnswer(currentNode.id, value));
      }
      return of(...actions);
    })
  );

/**
 * Dispatch condition action on condition result
 * @param action$
 * @param state$
 * @returns {*} [Array][Object] arrayActions
 */
export const epicCatchDispatchCondition = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_CONDITION),
    switchMap((action) => {
      const actions = [];

      const { diagnosticId, nodeId } = action.payload;
      const diagnostic = state$.value.diagnostics[diagnosticId];
      const { nodes } = state$.value;
      const currentInstance = diagnostic.instances[nodeId];
      const currentNode = nodes[nodeId];
      const parentsNodes = getParentsNodes(state$, diagnosticId, nodeId);
      const currentConditionValue = find(nodes[currentInstance.id].dd, (d) => d.id === diagnosticId);

      // If the complaint category linked to the diagnostic is not selected we set the condition value to false
      if (diagnostic.isExcludedByComplaintCategory(nodes)) {
        if (currentConditionValue.conditionValue !== false) {
          actions.push(updateConditionValue(nodeId, diagnosticId, false, diagnostic.type));
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
        const conditionValue = currentInstance.calculateCondition(state$);
        // If the condition of this node is not null
        if (parentConditionValue === false) {
          // Stop infinite loop, change only when conditionValue is different
          if (currentConditionValue.conditionValue !== false) {
            // Set parent to false if their condition's isn't correct. Used to stop the algorithm
            actions.push(updateConditionValue(nodeId, diagnosticId, false, diagnostic.type));
          }
        } else if (conditionValue !== null) {
          // Stop infinite loop, change only whene conditionValue is different
          if (currentConditionValue.conditionValue !== conditionValue) {
            actions.push(updateConditionValue(nodeId, diagnosticId, conditionValue, diagnostic.type));
          }

          // If the node is answered go his children
          if (currentNode.answer !== null) {
            actions.push(dispatchNodeAction(nodeId, diagnosticId, nodeTypes.diagnostic));
          }
        }
      }

      return of(...actions);
    })
  );

export default combineEpics(
  epicCatchDispatchFormulaNodeAction,
  epicCatchQuestionsSequenceAction,
  epicCatchAnswer,
  epicCatchFinalDiagnosticAction,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition
);
