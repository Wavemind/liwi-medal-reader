import { ofType } from 'redux-observable';
import find from 'lodash/find';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { actions } from '../../actions/types.actions';
import { nodesType } from '../../constants';
import {
  conditionValueDiseasesChange,
  diagnosisChildren,
  dispatchCondition,
  dispatchNodeAction,
  questionsSequencesChildren,
  setAnswer,
} from '../../actions/creators.actions';
import {
  getParentsNodes,
  getStateToThisPs,
  calculateCondition,
} from '../../algorithm/algoTreeDiagnosis';

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
      console.log({ STATE: state$.value });

      const currentNode = state$.value.nodes[index];
      const relatedDiagnostics = currentNode.dd;
      const relatedQuestionsSequence = currentNode.qs;

      let arrayActions = [];

      relatedDiagnostics.map((diagnostic) =>
        arrayActions.push(dispatchNodeAction(index, diagnostic.id))
      );

      relatedQuestionsSequence.map((questionsSequence) =>
        arrayActions.push(questionsSequencesChildren(questionsSequence.id, index))
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

      const { nodeId, callerId } = action.payload;
      const node = state$.value.nodes[nodeId] === undefined ? state$.value.diagnostics[nodeId] : state$.value.nodes[nodeId];
      const caller = state$.value.nodes[callerId] === undefined ? state$.value.diagnostics[callerId] : state$.value.nodes[callerId];

      // eslint-disable-next-line no-console
      console.log(
        '%c --- epicCatchDispatchNodeAction --- ',
        'background: #FF4500; color: #F6F3ED; padding: 5px',
        'déclenché :',
        node,
        ' > : ',
        caller,
      );

      let nodeChildren;

      // What do we do with this child -> switch according to type
      switch (caller.type) {
        case nodesType.question:
          return of(dispatchCondition(node.id, caller.id));
        case nodesType.finalDiagnostic:
          return of(diagnosisChildren(node.id, caller.id));
        case nodesType.healthCare:
          // TODO: to implement
          return [];
        case nodesType.diagnostic:

          // Get children of the node in the current diagnostic
          nodeChildren = caller.nodes[node.id].children;
          // Check children of the node in the current diagnostic and process them as well.
          nodeChildren.map((childId) => {
            arrayActions.push(
              dispatchNodeAction(
                caller.id,
                childId,
              )
            );
          });

          return of(...arrayActions);
        case nodesType.questionsSequence:
          // TODO : Handle QS
          // HERE calcule condition of node type PS
          return of(dispatchCondition(node.id, caller.id));
        //return of(questionsSequencesChildren(caller, node));
        default:
          // eslint-disable-next-line no-console
          console.log(
            '%c --- DANGER --- ',
            'background: #FF0000; color: #F6F3ED; padding: 5px',
            'nodes type ',
            caller.type,
            'doesn\'t exist'
          );
          return [];
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// TODO : finish it
export const epicCatchPredefinedSyndromeChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_QUESTIONS_SEQUENCES_CHILDREN),
    switchMap((action) => {
      // Processed with a PS
      const { indexPS, indexChild } = action.payload;

      // Here get the state if this PS
      const qs = state$.value.nodes[indexPS];

      // Let check the condition of this qs
      const topConditionCheckerPs = calculateCondition(
        state$,
        null,
        null,
        qs
      );

      let answeredId = null;
      let actions = [];

      if (topConditionCheckerPs === true) {
        answeredId = qs.answers[Object.keys(qs.answers)[0]].id;
      } else if (topConditionCheckerPs === false) {
        answeredId = qs.answers[Object.keys(qs.answers)[1]].id;
      } else if (topConditionCheckerPs === null) {
        // TODO if top parent question is reset to null, reset children question condition value to false
        getStateToThisPs(state$, qs, actions);
      }

      // eslint-disable-next-line no-console
      console.log(
        'starte PS :',
        qs.id,
        qs,
        topConditionCheckerPs,
        'state du qs :',
        actions,
        'index child :',
        indexChild
      );
      // eslint-disable-next-line no-console
      console.log(indexPS, ' -> ce PS a comme réponse : ', answeredId);

      if (answeredId !== qs.answer) {
        // actions.push(dispatchNodeAction(qs.id, indexChild, qs.type));

        return of(...actions, setAnswer(qs.id, answeredId));
      } else {
        // emit nothing....
        return of(...[]);
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process final diagnostic by checking his conditions then process its health cares
export const epicCatchDiagnosisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DIAGNOSIS_CHILDREN),
    switchMap((action) => {
      const { indexDD, indexDiagnosis } = action.payload;
      const child = state$.value.nodes[indexDiagnosis];

      // Get the conditions of the node
      const condition = calculateCondition(
        state$,
        indexDD,
        indexDiagnosis,
        child
      );

      // eslint-disable-next-line no-console
      console.log(indexDD, '-> conditon of this final node', condition);
      // Check the condition of the children
      return of(...[]);
    })
    // TODO : Trigger Treatment/Management handling
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Dispatch condition action on condition result
export const epicCatchDispatchCondition = (action$, state$) =>
  action$.pipe(
    ofType(actions.DISPATCH_CONDITION),
    switchMap((action) => {
      let actions = [];

      const { diagnosticId, nodeId } = action.payload;
      const currentNode = state$.value.diagnostics[diagnosticId].nodes[nodeId];

      // TODO: C'est possible ?
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

      const parentsNodes = getParentsNodes(state$, diagnosticId, nodeId);

      // some() – returns true if the function returns true for at least one of the items
      // If one parentsNodes has to be show and answered
      // TODO: Faut que tu m'expliques exactement a quoi sert le résultat de cette fonction (pour mick de quentin)
      let parentConditionValue = parentsNodes.some((i) => {
        let parentNode = state$.value.nodes[i];
        let diagnostic = find(parentNode.dd, (nodeDiagnostic) => nodeDiagnostic.id === diagnosticId);
        return parentNode.answer !== null && diagnostic.conditionValue === true;
      });

      // Get node condition value
      const conditionValue = calculateCondition(
        state$,
        diagnosticId,
        currentNode.id,
        currentNode
      );

      // IF the condition is not null
      if (conditionValue !== null) {
        actions.push(
          conditionValueDiseasesChange(nodeId, diagnosticId, conditionValue)
        );

        // if the node is answered go his children
        if (state$.value.nodes[nodeId].answer !== null) {
          actions.push(dispatchNodeAction(nodeId, diagnosticId, nodesType.diagnostic));
        }
      } else if (parentConditionValue === false) {
        // Set parent to false if their condition's isn't correct. Used to stop the algorithm
        actions.push(conditionValueDiseasesChange(nodeId, diagnosticId, false));
      }

      return of(...actions);
    })
  );
