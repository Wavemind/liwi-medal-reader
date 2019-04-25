import { ofType } from 'redux-observable';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import { nodesType } from '../../../constants';
import { of } from 'rxjs';
import { actions } from '../../actions/types.actions';
import { concatMap, filter, switchMap } from 'rxjs/operators';
import {
  conditionValueDiseasesChange,
  diagnosisChildren,
  diseasesChildren,
  dispatchNodeAction,
  predefinedSyndromeChildren,
  setPsAnswer,
  setQuestion,
  dispatchPSAction,
} from '../../actions/creators.actions';
import {
  getParentsOfThisNode,
  getStateToThisPs,
  nodeConditionChecker,
} from '../../algorithm/algoTreeDiagnosis';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state is updated.*/

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Loop on diagnostics AND
// TODO make PS change side effect
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_QUESTION_SET),
    switchMap((action) => {
      // Index is the id of the node that has just been answered
      const { index } = action.payload;

      console.log(
        '%c ########################  epicCatchAnswer ########################',
        'background: #F6F3EE; color: #b84c4c; padding: 5px'
      );
      console.log({ STATE: state$.value });

      const node = state$.value.nodes[index];
      const nodeDdParents = node.dd;
      const nodePsParents = node.ps;

      let arrayActions = [];

      nodeDdParents.map((dd) =>
        // Define disease type so it will not be considered as node
        arrayActions.push(dispatchNodeAction(index, dd.id, nodesType.d))
      );

      nodePsParents.map((ps) =>
        arrayActions.push(predefinedSyndromeChildren(ps.id, index))
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
    switchMap((action) => {
      // indexNode = node that has just been answered
      // indexChild = dd or ps being affected by the node
      let { indexNode, indexChild, typeChild } = action.payload;

      // indexNode = Parent node
      // indexChild = node that is affected by it
      let arrayActions = [];

      // Since it is not a disease, we know it is a node then we look for its type
      if (typeChild === null) {
        typeChild = state$.value.nodes[indexChild].type;
      }

      let typeNode;
      if (state$.value.nodes[indexNode] === undefined) {
        typeNode = 'diseases';
      } else {
        typeNode = state$.value.nodes[indexNode].type;
      }

      console.log(
        '%c --- NODES --- ',
        'background: #FF4500; color: #F6F3ED; padding: 5px',
        'déclenché :',
        indexNode,
        typeNode,
        ' > : ',
        indexChild,
        typeChild,
      );

      let nodeChildren;

      // What do we do with this child -> switch according to type
      switch (typeChild) {
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
            arrayActions.push(
              dispatchNodeAction(
                indexChild,
                childId,
                state$.value.nodes[childId].type
              )
            )
          );

          return of(...arrayActions);
        case nodesType.ps:
          // TODO : Handle PS
          // HERE calcule condition of node type PS
          return of(diseasesChildren(indexNode, indexChild));
        //return of(predefinedSyndromeChildren(indexChild, indexNode));
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// TODO : finish it
export const epicCatchPredefinedSyndromeChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_PREDEFINED_SYNDROME_CHILDREN),
    switchMap((action) => {
      // Processed with a PS
      const { indexPS, indexChild } = action.payload;

      // Here get the state if this PS
      const ps = state$.value.nodes[indexPS];

      // Let check the condition of this ps
      const topConditionCheckerPs = nodeConditionChecker(
        state$,
        null,
        null,
        ps
      );

      let answeredId = null;
      let actions = [];

      if (topConditionCheckerPs === true) {
        answeredId = ps.answers[Object.keys(ps.answers)[0]].id;
      } else if (topConditionCheckerPs === false) {
        answeredId = ps.answers[Object.keys(ps.answers)[1]].id;
      } else if (topConditionCheckerPs === null) {
        // TODO if top parent question is reset to null, reset children question condition value to false
        getStateToThisPs(state$, ps, actions);
      }

      console.log(
        'starte PS',
        ps.id,
        ps,
        topConditionCheckerPs,
        'state du ps',
        actions
      );

      console.log(indexPS, ' -> ce PS a comme réponse : ', answeredId);

      if (answeredId !== ps.answer) {
        // actions.push(dispatchNodeAction(ps.id, indexChild, ps.type));

        return of(...actions, setQuestion(ps.id, answeredId));
      } else {
        // emit nothing....
        return of();
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process final diagnostic by checking his conditions then process its health cares
export const epicCatchDiagnosisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DIAGNOSIS_CHILDREN),
    filter((action) => {

      const { indexDD, indexChild } = action.payload;

      const child = state$.value.nodes[indexChild];

      // Get the conditions of the node
      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexChild,
        child
      );

      console.log('-> conditon of this final node', condition);
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
    switchMap((action) => {
      const { indexDD, indexChild } = action.payload;
      const child = state$.value.diseases[indexDD].nodes[indexChild];

      // If the algo is wrong with the nodes
      // TODO catch nice error from JSON
      if (child === undefined) {
        console.error(
          ' The child',
          indexChild,
          'do not exist in diseases',
          indexDD
        );
        return of();
      }

      // Get the conditions of the node
      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexChild,
        child
      );
      let actions = [];

      console.log('node', indexChild, ' is ', condition, 'for', indexDD);

      let findActuelConditionValue = findIndex(
        state$.value.nodes[indexChild].dd,
        (o) => o.id === indexDD
      );

      let parents = getParentsOfThisNode(state$, indexDD, indexChild);

      // some() – returns true if the function returns true for at least one of the items
      // If one parents has to be show and answered
      let finder = parents.some((i) => {
        let node = state$.value.nodes[i];
        let findDiseasesId = find(node.dd, (p) => p.id === indexDD);
        return node.answer !== null && findDiseasesId.conditionValue === true;
      });

      console.log(finder, 'finder parents')

      // Update the condition value if it is different from the current one
      // if (
      //   state$.value.nodes[indexChild].dd[findConditionValue].conditionValue !==
      //   condition
      // ) {
      // IF the node is always possible we do nothing

      // IF the condition is not null
      console.log('here',state$.value.nodes[indexChild], condition)

      if (condition !== null) {
        actions.push(
          conditionValueDiseasesChange(indexChild, indexDD, condition)
        );

        // if the node is answered we go deeper
        if (state$.value.nodes[indexChild].answer !== null) {
          actions.push(dispatchNodeAction(indexChild, indexDD, nodesType.d));
        }

      } else if (finder === false) {
        // reset conditionValue to false
        actions.push(conditionValueDiseasesChange(indexChild, indexDD, false));
      }
      // }

      return of(...actions);
    })
  );
