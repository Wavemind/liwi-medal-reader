import { ofType } from 'redux-observable';
import { filter, mergeMap } from 'rxjs/operators';
import { actions } from '../../actions/types.actions';

import { of } from 'rxjs';
import {
  decrementCounter,
  incrementCounter,
  nodeOfThisChildren,
} from '../../actions/creators.actions';
import {
  actionFactoryTypeNode,
  nodeConditionChecker,
} from '../../algorithme/algoTreeDiagnosis';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state updated.*/

// First call
// Loop on diagnostics AND TODO make PS change side effect (not the partie socialiste hein... )
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_QUESTION_SET),
    mergeMap((action) => {
      // Index = id of the node that has just changed
      const { index, value } = action.payload;

      console.log('******************* epicCatchAnswer *******************');

      console.log({ state: state$.value });

      const childrensDD = state$.value.nodes[index].dd;
      const childrensPS = state$.value.nodes[index].ps;

      let arrayActions = [];

      childrensDD.map((indexDD) =>
        arrayActions.push(nodeOfThisChildren(index, indexDD, 'diseases'))
      );

      childrensPS.map((indexPS) =>
        arrayActions.push(nodeOfThisChildren(index, indexPS))
      );

      return of(...arrayActions);
    })
  );

// Second call
// Loop on children's node
export const epicCatchNodeOfThisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_NODE_CHILDREN),
    mergeMap((action) => {
      // indexNode = node that has just been answered
      // indexChild = this indexNode has an impact on indexChild
      // What do we do with this indexChild -> switch according to type
      const { indexNode, indexChild, type } = action.payload;

      console.log(
        '--- NODES ---',
        'cliqué :',
        indexNode,
        'suivant : ',
        indexChild,
        type
      );

      let actions = actionFactoryTypeNode(state$, indexNode, indexChild, type);

      return of(...actions);
    })
  );

// Third call
// Loop on children's node of type final diagnostics
export const epicCatchDiagnosisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DIAGNOSIS_CHILDREN),
    filter((action) => {
      // For one node, what i do ?
      // Check the condition for the node, according type
      const { indexDD, indexDiagnosis } = action.payload;

      const child = state$.value.nodes[indexDiagnosis];

      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexDiagnosis,
        child
      );

      console.log('conditon of this final diagnosis', condition);
      // Check the condition of the children
    })
  );

// Third call
// Loop on children's node of type question
export const epicCatchDiseasesChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DISEASES_CHILDREN),
    mergeMap((action) => {
      // For one node, what i do ?
      // Check the condition for the node, by type
      const { indexDD, indexChild } = action.payload;
      const child = state$.value.diseases[indexDD].nodes[indexChild];

      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexChild,
        child
      );
      let actions = [];

      console.log('question', indexChild, ' is ', condition, 'for', indexDD);

      // will be change... aie aie aie
      switch (condition) {
        case true:
          actions.push(incrementCounter(indexChild));
          break;
        case false:
          actions.push(decrementCounter(indexChild));
          break;
        case null:
          break;
      }

      return of(...actions);
      // Check the condition of the children
    })
  );
