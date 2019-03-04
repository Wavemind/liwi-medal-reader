import { ofType } from 'redux-observable';
import { concatMap, filter } from 'rxjs/operators';
import { actions } from '../../actions/types.actions';

import { of } from 'rxjs';
import {
  conditionValueChange,
  diagnosisChildren,
  diseasesChildren,
  nodeOfThisChildren,
  predefinedSyndromeChildren,
  setPsAnswer,
} from '../../actions/creators.actions';
import {
  getStateToThisPs,
  nodeConditionChecker,
} from '../../algorithme/algoTreeDiagnosis';
import findIndex from 'lodash/findIndex';
import { nodesType } from '../../../utils/constants';
import find from 'lodash/find';
/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state updated.*/

// First call
// Loop on diagnostics AND TODO make PS change side effect (not the partie socialiste hein... )
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_QUESTION_SET),
    concatMap((action) => {
      // Index = id of the node that has just changed
      const { index, value } = action.payload;

      console.log(
        '%c ########################  epicCatchAnswer ########################   ',
        'background: #F6F3EE; ' + 'color: #b84c4c; padding: 5px'
      );

      console.log({ state: state$.value });

      const childrensDD = state$.value.nodes[index].dd;
      const childrensPS = state$.value.nodes[index].ps;

      let arrayActions = [];

      childrensDD.map((indexDD) =>
        arrayActions.push(nodeOfThisChildren(index, indexDD.id, 'diseases'))
      );

      childrensPS.map((indexPS) =>
        arrayActions.push(nodeOfThisChildren(index, indexPS.id))
      );

      return of(...arrayActions);
    })
  );

// Second call
export const actionFactoryTypeNode = (
  state$,
  indexNode,
  indexChild,
  type
) => {};
// Loop on children's node
export const epicCatchNodeOfThisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_NODE_CHILDREN),
    concatMap((action) => {
      // indexNode = node that has just been answered
      // indexChild = this indexNode has an impact on indexChild
      // What do we do with this indexChild -> switch according to type
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
      let childrenNodes;

      // WORKAROUND because they dont want diseases in nodes
      if (type === null) {
        type = state$.value.nodes[indexChild].type;
      }

      switch (type) {
        case nodesType.q:
          // Go to this sample question
          return of(diseasesChildren(indexNode, indexChild));
        case nodesType.t:
          // Treatment
          break;
        case nodesType.fd:
          // Ho next node is Final Diagnostic
          return of(diagnosisChildren(indexNode, indexChild));
        case nodesType.m:
          break;
        case nodesType.d:
          // NEXT CHILDREN
          // This node affects a disease, we go on the children of this node in this diseases
          childrenNodes =
            state$.value.diseases[indexChild].nodes[indexNode].children;

          // We will see the type of child of this node and perform the right action
          childrenNodes.map((childId) =>
            arrayActions.push(nodeOfThisChildren(indexChild, childId))
          );
          return of(...arrayActions);
        case nodesType.ps:
          // PS EFFECT CHANGE !
          // Calcul change of PS
          return of(predefinedSyndromeChildren(indexChild, indexNode));
      }
    })
  );

// Loop on children's node od type predef syndrome

export const epicCatchPredefinedSyndromeChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_PREDEFINED_SYNDROME_CHILDREN),
    concatMap((action) => {
      // For one node, what i do ?
      // Check the condition for the node, according type
      const { indexPS, indexChild } = action.payload;

      // Here get the state if this PS
      const ps = state$.value.nodes[indexPS];

      let stateOfPs = getStateToThisPs(state$, ps);

      return of(setPsAnswer(ps.id, stateOfPs));

      // Check the condition of the children
    })
  );

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
    concatMap((action) => {
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
      let findConditionValue = findIndex(
        state$.value.nodes[indexChild].dd,
        (o) => o.id === indexDD
      );

      // If condition value is different from the old
      // We take the index in array, be carreful
      if (
        state$.value.nodes[indexChild].dd[findConditionValue].conditionValue !==
        condition
      ) {
        actions.push(
          conditionValueChange(indexChild, findConditionValue, condition)
        );
      }

      return of(...actions);
      // Check the condition of the children
    })
  );
