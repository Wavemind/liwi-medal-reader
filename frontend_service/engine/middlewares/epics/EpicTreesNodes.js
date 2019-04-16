import { ofType } from 'redux-observable';
import findIndex from 'lodash/findIndex';
import { nodesType } from '../../../constants';
import { of } from 'rxjs';
import { actions } from '../../actions/types.actions';
import { concatMap, filter } from 'rxjs/operators';
import {
  conditionValueChange,
  diagnosisChildren,
  diseasesChildren,
  dispatchNodeAction,
  predefinedSyndromeChildren,
  setPsAnswer,
} from '../../actions/creators.actions';
import {
  getStateToThisPs,
  nodeConditionChecker,
} from '../../algorithm/algoTreeDiagnosis';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state is updated.*/

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Loop on diagnostics AND PS
// TODO make PS change side effect
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_QUESTION_SET),
    concatMap((action) => {
      // Index is the id of the node that has just been answered
      const { index } = action.payload;

      console.log(
        '%c ########################  epicCatchAnswer ########################',
        'background: #F6F3EE; color: #b84c4c; padding: 5px'
      );
      console.log({ state: state$.value });

      const node = state$.value.nodes[index];
      const nodeDdParents = node.dd;
      const nodePsParents = node.ps;

      let arrayActions = [];

      nodeDdParents.map((dd) =>
        // Define disease type so it will not be considered as node
        arrayActions.push(dispatchNodeAction(index, dd.id, nodesType.d))
      );

      nodePsParents.map((ps) =>
        arrayActions.push(dispatchNodeAction(index, ps.id))
      );

      return of(...arrayActions);
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process the impacted node according to his type
// TODO : Handle Treatment/Management
export const epicCatchDispatchNodeAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_NODE_CHILDREN),
    concatMap((action) => {
      // indexNode = node that has just been answered
      // indexChild = dd or ps being affected by the node
      let { indexNode, indexChild, type } = action.payload;

      console.log(
        '--- NODES ---',
        'cliqué :',
        indexNode,
        'suivant : ',
        indexChild,
        type
      );

      // indexNode = Parent node
      // indexChild = node that is affected by it
      let arrayActions = [];

      // Since it is not a disease, we know it is a node then we look for its type
      if (type === null) {
        type = state$.value.nodes[indexChild].type;
      }

      let nodeChildren;

      // What do we do with this child -> switch according to type
      switch (type) {
        case nodesType.q:
          // Go to this sample question
          return of(diseasesChildren(indexNode, indexChild));
        case nodesType.t:
          // Treatment
          return null;
        case nodesType.fd:
          // Ho next node is Final Diagnostic
          return of(diagnosisChildren(indexNode, indexChild));
        case nodesType.m:
          return null;
        case nodesType.d:
          // Get children of the node in the current diagnostic
          nodeChildren =
            state$.value.diseases[indexChild].nodes[indexNode].children;

          // Check children of the node in the current diagnostic and process them as well.
          nodeChildren.map((childId) =>
            arrayActions.push(dispatchNodeAction(indexChild, childId))
          );
          return of(...arrayActions);
        case nodesType.ps:
          // TODO : Handle PS
          return of(predefinedSyndromeChildren(indexChild, indexNode));
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// TODO : finish it
export const epicCatchPredefinedSyndromeChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_PREDEFINED_SYNDROME_CHILDREN),
    concatMap((action) => {
      // For one node, what i do ?
      // Check the condition for the node, according type
      const { indexPS } = action.payload;

      // Here get the state if this PS
      const ps = state$.value.nodes[indexPS];


      let stateOfPs = getStateToThisPs(state$, ps);


      let answeredId;
      if (stateOfPs === true) {
        answeredId = ps.answers[Object.keys(ps.answers)[0]].id;
      } else if (stateOfPs === false) {
        answeredId = ps.answers[Object.keys(ps.answers)[1]].id;
      }

      console.log(answeredId)

      // if (answeredId !== ps.answer) {
        return of(setPsAnswer(ps.id, answeredId));
      // }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process final diagnostic by checking his conditions then process its health cares
export const epicCatchDiagnosisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DIAGNOSIS_CHILDREN),
    filter((action) => {
      const { indexDD, indexDiagnosis } = action.payload;
      const child = state$.value.nodes[indexDiagnosis];

      // Get the conditions of the node
      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexDiagnosis,
        child
      );

      console.log('conditon of this final diagnosis', condition);
      // Check the condition of the children
    })
    // TODO : Trigger Treatment/Management handling
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process node children in the dd
export const epicCatchDiseasesChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DISEASES_CHILDREN),
    concatMap((action) => {
      const { indexDD, indexChild } = action.payload;
      const child = state$.value.diseases[indexDD].nodes[indexChild];

      // Get the conditions of the node
      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexChild,
        child
      );
      let actions = [];

      console.log('question', indexChild, ' is ', condition, 'for', indexDD);
      let findConditionValue = findIndex(
        state$.value.nodes[indexChild].dd,
        (o) => o.id === indexDD
      );

      // Update the condition value if it is different from the current one
      if (
        state$.value.nodes[indexChild].dd[findConditionValue].conditionValue !==
        condition
      ) {
        actions.push(
          conditionValueChange(indexChild, findConditionValue, condition)
        );
      }

      return of(...actions);
    })
  );
