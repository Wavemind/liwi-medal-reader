import { combineEpics, ofType } from 'redux-observable';
import find from 'lodash/find';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { actions } from '../actions/types.actions';
import { displayFormats, nodesType } from '../constants';
import {
  updateConditionValue,
  dispatchFinalDiagnosticAction,
  dispatchCondition,
  dispatchNodeAction,
  dispatchQuestionsSequenceAction,
  setAnswer,
  dispatchFormulaNodeAction,
} from '../actions/creators.actions';
import {
  getParentsNodes,
  getQuestionsSequenceStatus,
} from './algoTreeDiagnosis';
import { calculateFormula } from './algoConditionsHelpers';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state is updated.*/

/**
 * Loop on diagnostics AND QS
 *
 * @params [Object] action$, [Object] state$
 * @return [Array][Object] arrayActions
 **/
// TODO make PS change side effect
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_ANSWER),
    switchMap((action) => {
      // Index is the id of the node that has just been answered
      const { index } = action.payload;

      // eslint-disable-next-line no-console
      console.log(
        '%c ########################  epicCatchAnswer ########################',
        'background: #F6F3EE; color: #b84c4c; padding: 5px'
      );

      // eslint-disable-next-line no-console
      console.log({ STATE: state$.value }, index);

      const currentNode = state$.value.nodes[index];
      const relatedDiagnostics = currentNode.dd;
      const relatedQuestionsSequence = currentNode.qs;
      const relatedFormulaNodes = currentNode.fn;

      let arrayActions = [];

      relatedDiagnostics.map((diagnostic) =>
        arrayActions.push(
          dispatchNodeAction(index, diagnostic.id, nodesType.diagnostic)
        )
      );

      // IF this is a question we check formula
      if (currentNode.type === nodesType.question) {
        // TODO maybe we have to make formula here, not necessary dispatch action, what think others ?
        relatedFormulaNodes.map((formulaNode) =>
          arrayActions.push(dispatchFormulaNodeAction(formulaNode.id))
        );
      }

      relatedQuestionsSequence.map((questionsSequence) =>
        arrayActions.push(
          dispatchQuestionsSequenceAction(questionsSequence.id, index)
        )
      );

      return of(...arrayActions);
    })
  );

/**
 * Process the impacted node according to his type
 *
 * @params [Object] action$, [Object] state$
 * @return [Array][Object] arrayActions
 **/
// TODO : Handle HealthCares
export const epicCatchDispatchNodeAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.HANDLE_NODE_CHANGED),
    switchMap((action) => {
      let arrayActions = [];
      let caller;

      // TODO make a giant test about perf between ref id and object pass into action
      // TODO Test get node in state and comare with object in action, are there somes differences ?
      const { nodeId, callerId, callerType } = action.payload;

      if (callerType === nodesType.diagnostic)
        caller = state$.value.diagnostics[callerId];
      else if (callerType !== nodesType.diagnostic)
        caller = state$.value.nodes[callerId];

      // eslint-disable-next-line no-console
      console.log(
        '%c --- epicCatchDispatchNodeAction --- ',
        'background: #FF4500; color: #F6F3ED; padding: 5px',
        'déclenché :',
        nodeId,
        ' > : ',
        callerId,
        callerType
      );

      let nodeChildren;

      // What do we do with this child -> switch according to type
      switch (caller.type) {
        case nodesType.question:
          return of(dispatchCondition(nodeId, caller.id));
        case nodesType.finalDiagnostic:
          return of(dispatchFinalDiagnosticAction(nodeId, caller.id));
        case nodesType.healthCare:
          // TODO: to implement
          return [];
        case nodesType.diagnostic:
          // Get children of the node in the current diagnostic
          nodeChildren = caller.instances[nodeId].children;
          // Check children of the node in the current diagnostic and process them as well.
          nodeChildren.map((childId) => {
            arrayActions.push(
              dispatchNodeAction(
                caller.id,
                childId,
                state$.value.nodes[childId].type
              )
            );
          });

          return of(...arrayActions);
        case nodesType.questionsSequence:
          // TODO : Handle QS
          // HERE calcule condition of node type PS
          return of(dispatchCondition(nodeId, caller.id));
        //return of(dispatchQuestionsSequenceAction(caller, node));
        default:
          // eslint-disable-next-line no-console
          console.log(
            '%c --- DANGER --- ',
            'background: #FF0000; color: #F6F3ED; padding: 5px',
            'nodes type ',
            caller.type,
            "doesn't exist"
          );
          return [];
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// TODO : finish it
export const epicCatchQuestionsSequenceAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_QUESTIONS_SEQUENCE_ACTION),
    switchMap((action) => {
      const { questionsSequenceId } = action.payload;
      const currentQuestionsSequence = state$.value.nodes[questionsSequenceId];
      let answerId = null;
      let actions = [];
      let isReady;

      // Return the status of the QS
      // true = can reach the end
      // null = Still possible but uncaculable
      // false = can't access the end anymore

      isReady = getQuestionsSequenceStatus(
        state$,
        currentQuestionsSequence,
        actions
      );
      let questionsSequenceCondition = null;

      // If ready we calculate condition of the QS
      if (isReady) {
        // car on doit savoir si branch ouverte ou fermée
        questionsSequenceCondition = currentQuestionsSequence.calculateCondition();
      }

      if (currentQuestionsSequence.id === 181) {
        console.log(
          isReady,
          currentQuestionsSequence,
          questionsSequenceCondition
        );
      }

      if (questionsSequenceCondition === true) {
        answerId =
          currentQuestionsSequence.answers[
            Object.keys(currentQuestionsSequence.answers).first()
          ].id;
      } else if (questionsSequenceCondition === false || isReady === false) {
        answerId =
          currentQuestionsSequence.answers[
            Object.keys(currentQuestionsSequence.answers)[1]
          ].id;
      } else if (questionsSequenceCondition === null) {
        // The QS is still open
        console.log(currentQuestionsSequence);
        // TODO if top parent question is reset to null, reset children question condition value to false
      }

      // eslint-disable-next-line no-console
      // console.log(
      //   'starte PS :',
      //   currentQuestionsSequence.id,
      //   currentQuestionsSequence,
      //   questionsSequenceConditionValue,
      //   'state du qs :',
      //   actions,
      //   'index child :',
      //   callerId
      // );

      // eslint-disable-next-line no-console
      console.log(
        currentQuestionsSequence,
        ' -> ce PS a comme réponse : ',
        answerId,
        'condition result : ',
        questionsSequenceCondition,
        ' and is ',
        isReady,
        ' to calculate'
      );

      // If the new answer of this QS is different from the older, we change it
      if (answerId !== currentQuestionsSequence.answer) {
        // actions.push(dispatchNodeAction(qs.id, indexChild, qs.type));
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
      const { diagnosticId, finalDiagnosticId } = action.payload;
      const finalDiagnostic = state$.value.nodes[finalDiagnosticId];

      // Get the conditions of the node
      const condition = finalDiagnostic.calculateCondition();

      // eslint-disable-next-line no-console
      console.log(
        '%c --- epicCatchFinalDiagnosticAction --- ',
        'background: #eee; color: #000; padding: 5px',
        'Diagnostic id :',
        diagnosticId,
        '-> conditon of this final node',
        condition,
        'for ->',
        finalDiagnosticId
      );

      // Check the condition of the children
      return of(...[]);
    })
    // TODO : Trigger Treatment/Management handling
  );

export const epicCatchDispatchFormulaNodeAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_FORMULA_NODE_ACTION),
    switchMap((action) => {
      let actions = [];

      const { nodeId } = action.payload;

      const currentNode = state$.value.nodes[nodeId];

      // 0 to default
      // If the node was already calcutate but we want to reset the node the value will still be 0 and setAnswer set to 0
      let value = 0;
      if (currentNode.display_format === displayFormats.formula) {
        value = calculateFormula(currentNode);
      }

      if (value !== currentNode.value) {
        // actions.push(dispatchNodeAction(qs.id, indexChild, qs.type));
        actions.push(setAnswer(currentNode.id, value));
      }

      return of(...actions);
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Dispatch condition action on condition result
// TODO rename it... we dont know what is it
export const epicCatchDispatchCondition = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_CONDITION),
    switchMap((action) => {
      let actions = [];

      const { diagnosticId, nodeId } = action.payload;

      const currentNode =
        state$.value.diagnostics[diagnosticId]?.instances[nodeId];

      // INFO for debug if algo JSON is broken
      if (currentNode === undefined) {
        // eslint-disable-next-line no-console
        console.log(
          '%c --- DANGER --- ',
          'background: #FF0000; color: #F6F3ED; padding: 5px',
          ' The node',
          nodeId,
          'do not exist in diagnostics',
          diagnosticId
        );
        return of();
      }

      if (
        state$.value.nodes[nodeId].display_format === displayFormats.formula
      ) {
        calculateFormula(state$.value.nodes[nodeId]);
      }

      const parentsNodes = getParentsNodes(state$, diagnosticId, nodeId);

      // some() – returns true if the function returns true for at least one of the items
      // If one parentsNodes has to be show and answered
      let parentConditionValue = parentsNodes.some((i) => {
        let parentNode = state$.value.nodes[i];
        let diagnostic = find(
          parentNode.dd,
          (nodeDiagnostic) => nodeDiagnostic.id === diagnosticId
        );
        return parentNode.answer !== null && diagnostic.conditionValue === true;
      });

      // Get node condition value
      const conditionValue = currentNode.calculateCondition(state$);

      // If the condition of this node is not null
      if (conditionValue !== null) {
        actions.push(
          updateConditionValue(
            nodeId,
            diagnosticId,
            conditionValue,
            state$.value.diagnostics[diagnosticId].type
          )
        );

        // If the node is answered go his children
        if (state$.value.nodes[nodeId].answer !== null) {
          actions.push(
            dispatchNodeAction(nodeId, diagnosticId, nodesType.diagnostic)
          );
        }
      } else if (parentConditionValue === false) {
        // Set parent to false if their condition's isn't correct. Used to stop the algorithm
        actions.push(
          updateConditionValue(
            nodeId,
            diagnosticId,
            false,
            state$.value.diagnostics[diagnosticId].type
          )
        );
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
