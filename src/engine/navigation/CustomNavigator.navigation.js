import React from 'react';
import { RootMainNavigator } from './Root.navigation';
import { navigationActionConstant, priorities } from '../../../frontend_service/constants';
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

const validatorNavigate = (navigateRoute) => {
  let state$ = store.getState();

  const detailNavigateRoute = screens.find((s) => s.key === navigateRoute.routeName);

  if (detailNavigateRoute === null) {
    return true;
  }

  /*** Specific Validation ***/
  // MedicalCases Routes
  if (detailNavigateRoute.medicalCaseOrder !== undefined) {
    // the case is still in creation, do not permit to go into medical case
    if (detailNavigateRoute.medicalCaseOrder > 0 && state$.isNewCase === true) {
      // NavigationService.navigate(prevRoute.routeName, prevRoute.params);
      return false;
    }

    let prevMedicalOrder = screens.find((s) => s.medicalCaseOrder === detailNavigateRoute.medicalCaseOrder - 1);

    if (prevMedicalOrder !== undefined && prevMedicalOrder.medicalCaseOrder > 0) {
      let questionsToValidate = state$.metaData[prevMedicalOrder.key.toLowerCase()];

      let screenResults = Object.keys(prevMedicalOrder.validations).map((validation) => {
        let questions = questionsToValidate[validation];
        let criteria = prevMedicalOrder.validations[validation];

        let controls = Object.keys(criteria).map((c) => {
          switch (c) {
            case 'priority':
              return questions.every((questionId) => {
                let q = state$.nodes[questionId];
                if (q.priority === criteria[c]) {
                  return state$.nodes[questionId].answer !== null || state$.nodes[questionId].value !== null; // Mandatory weight has no answer
                }
                return true;
              });
            case 'answer':
              if (criteria[c] === 'not_null') {
                return questions.every((questionId) => state$.nodes[questionId].answer !== null);
              }
          }
        });
        // Need all condition to true
        return controls.every((c) => c === true);
      });

      let screenValidation = screenResults.every((c) => c === true);
      if (!screenValidation) {
        Toaster('The screen ' + prevMedicalOrder.key + ' is not not valid', { type: 'danger', duration: 10000 });
        store.dispatch(updateModalFromRedux('The screen ' + prevMedicalOrder.key + ' is not not valid (why ?) . content has to be defined by PMU'));
      }
      return screenValidation;
    }
  }

  return true;
};

class CustomNavigator extends React.Component {
  static router = {
    ...RootMainNavigator.router,
    getStateForAction: (action, lastState) => {
      // https://reactnavigation.org/docs/en/custom-routers.html#getstateforactionaction-state
      // check for custom actions and return a different navigation state.
      // console.log(StaticRootNavigator.router);
      let validation = true;
      switch (action.type) {
        case navigationActionConstant.navigate:
        case navigationActionConstant.replace:
          // console.log(screens, action, lastState, NavigationService.getCurrentRoute(lastState));
          // eslint-disable-next-line no-case-declarations
          let prevRoute = NavigationService.getCurrentRoute(lastState);
          validation = validatorNavigate(action, prevRoute);
          break;

        case navigationActionConstant.setParams:
          break;
      }

      if (validation) {
        return RootMainNavigator.router.getStateForAction(action, lastState);
      }

      return null;
    },
  };

  state = {};

  render() {
    const { navigation } = this.props;

    return <RootMainNavigator navigation={navigation} />;
  }
}

export default CustomNavigator;
