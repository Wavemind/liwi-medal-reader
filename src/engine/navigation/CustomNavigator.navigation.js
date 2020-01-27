import React from 'react';
import _ from 'lodash';
import { RootMainNavigator } from './Root.navigation';
import { medicalCaseStatus, navigationActionConstant, priorities } from '../../../frontend_service/constants';
import NavigationService from './Navigation.service';
import { store } from '../../../frontend_service/store';
import { Toaster } from '../../utils/CustomToast';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const screens = [
  { key: 'Home' },
  { key: 'PatientUpsert', medicalCaseOrder: 0 },
  {
    key: 'Triage',
    medicalCaseOrder: 1,
    validations: {
      firstLookAssessments: { priority: priorities.mandatory, initialPage: 0 },
      complaintCategories: { answer: 'not_null', initialPage: 1 },
      basicMeasurements: { priority: priorities.mandatory, initialPage: 2 },
    },
  },
  { key: 'Consultation', medicalCaseOrder: 2, validations: { medicalHistory: {}, physicalExam: {} } },
  { key: 'Tests', medicalCaseOrder: 3, validations: {} },
  { key: 'DiagnosticsStrategy', medicalCaseOrder: 4, validations: {} },
];

const modelValidator = {
  isActionValid: true,
  routeRequested: null,
  stepToBeFill: [],
  screenToBeFill: [],
  questionsToBeFill: [],
};

const validatorStep = (route, lastState, validator) => {
  const state$ = store.getState();

  if (route?.params?.initialPage && route.params.initialPage > 0) {
    const detailSetParamsRoute = screens.find((s) => s.key === route.routeName);
    const detailValidation = _.findKey(detailSetParamsRoute.validations, (v) => v.initialPage === route.params.initialPage - 1);
    let questionsToValidate = state$.metaData[route.routeName.toLowerCase()];

    let questions = questionsToValidate[detailValidation];
    let criteria = detailSetParamsRoute.validations[detailValidation];
    return oneValidation(criteria, questions, detailValidation);
  }
  return validator;
};

/**
 * @return {boolean}
 */
function oneValidation(criteria, questions, stepName) {
  let state$ = store.getState();
  let result;
  let isValid = true;
  // Break Ref JS
  let staticValidator = JSON.parse(JSON.stringify(modelValidator));
  staticValidator.stepName = stepName;
  console.log(criteria, questions, staticValidator);

  Object.keys(criteria).map((c) => {
    switch (c) {
      case 'priority':
        questions.forEach((questionId) => {
          let q = state$.nodes[questionId];
          if (q.priority === criteria[c]) {
            result = state$.nodes[questionId].answer !== null || state$.nodes[questionId].value !== null;
            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(state$.nodes[questionId]);
            }
          }
        });
        break;
      case 'answer':
        if (criteria[c] === 'not_null') {
          questions.forEach((questionId) => {
            let q = state$.nodes[questionId];
            result = q.answer !== null;
            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(q);
            }
          });
        }
        break;

      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  });
  // Need all condition to true

  staticValidator.isActionValid = isValid;
  return staticValidator;
}

const validatorNavigate = (navigateRoute, lastState) => {
  let state$ = store.getState();

  // Break Ref JS
  let validator = JSON.parse(JSON.stringify(modelValidator));

  // Get validation from constant
  const detailNavigateRoute = screens.find((s) => s.key === navigateRoute.routeName);

  // If the route is not in the constant
  if (detailNavigateRoute === null) {
    validator.isActionValid = true;
    return validator;
  }

  /*** Specific Validation ***/

  /** MedicalCases Routes **/

  if (detailNavigateRoute.medicalCaseOrder !== undefined) {
    /** the case is still in creation, do not permit to go into medical case **/

    if (detailNavigateRoute.medicalCaseOrder > 0 && state$.isNewCase === true) {
      validator.isActionValid = false;
      return validator;
    }

    // Prev route in medicalCase
    let prevMedicalOrder = screens.find((s) => s.medicalCaseOrder === detailNavigateRoute.medicalCaseOrder - 1);

    // Prev route is not null and can be validated
    if (prevMedicalOrder !== undefined && prevMedicalOrder.medicalCaseOrder > 0) {
      // Questions to be validated
      let questionsToValidate = state$.metaData[prevMedicalOrder.key.toLowerCase()];

      // Get order of screen
      let indexStatus = medicalCaseStatus[state$.status].main;
      let requestedStatus = screens.find((s) => s.key === navigateRoute.routeName).medicalCaseOrder;

      // Diff between prev and next index in order
      let diffStatus = requestedStatus - indexStatus;

      /** Block action if screen prev **/
      // Route requested is way to long in the medicalCase process
      if (indexStatus !== null && diffStatus > 1) {
        validator.isActionValid = false;
        validator.routeRequested = navigateRoute.routeName;
        validator.screenToBeFill = prevMedicalOrder.key;
        return validator;
      }

      // Check precedent screen if valid
      let screenResults = Object.keys(prevMedicalOrder.validations).map((validation) => {
        let questions = questionsToValidate[validation];
        let criteria = prevMedicalOrder.validations[validation];
        // Validation on each Step
        return oneValidation(criteria, questions, validation);
      });

      // All step has to be valide
      validator.isActionValid = screenResults.every((c) => c.isActionValid === true);
      validator.stepToBeFill = screenResults;

      console.log('-----', detailNavigateRoute, navigateRoute, validator);

      if (!validator.isActionValid) {
        Toaster('The screen ' + prevMedicalOrder.key + ' is not not valid', {
          type: 'danger',
          duration: 10000,
        });
        store.dispatch(updateModalFromRedux('The screen ' + prevMedicalOrder.key + ' is not valid (why ?) . content has to be defined by PMU'));
        validator.routeRequested = navigateRoute.routeName;
        validator.screenToBeFill = prevMedicalOrder.key;
      }
      return validator;
    }

    // Validate initial Step to check
    if (navigateRoute?.params?.initialPage !== undefined && navigateRoute?.params?.initialPage > 0) {
      let step = validatorStep(navigateRoute, lastState, validator);
      console.log(step);
      if (!validator.isActionValid) {
        Toaster('You cant access the step in this ' + navigateRoute.routeName, { type: 'danger', duration: 10000 });
        store.dispatch(updateModalFromRedux('You cant access the step in this ' + navigateRoute.routeName));
      }
    }
  }
  return validator;
};

class CustomNavigator extends React.Component {
  static router = {
    ...RootMainNavigator.router,
    getStateForAction: (action, lastState) => {
      // https://reactnavigation.org/docs/en/custom-routers.html#getstateforactionaction-state
      // check for custom actions and return a different navigation state.
      let validation = {
        isActionValid: true,
      };

      switch (action.type) {
        case navigationActionConstant.navigate:
        case navigationActionConstant.replace:
          // console.log(screens, action, lastState, NavigationService.getCurrentRoute(lastState));
          // eslint-disable-next-line no-case-declarations
          validation = validatorNavigate(action, lastState);
          console.log(validation);
          break;

        case navigationActionConstant.setParams:
          const route = NavigationService.getActiveRouteByKey(action, lastState);
          validation = validatorStep(route, lastState, modelValidator);
          console.log(validation);
          break;
      }

      console.log('Final validation', validation, action);
      if (validation.isActionValid) {
        return RootMainNavigator.router.getStateForAction(action, lastState);
      } else {
        store.dispatch(updateModalFromRedux(null, validation));
        return null;
      }
    },
  };

  state = {};

  render() {
    const { navigation } = this.props;

    return <RootMainNavigator navigation={navigation} />;
  }
}

export default CustomNavigator;
