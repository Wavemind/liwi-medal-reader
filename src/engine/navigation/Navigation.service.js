import { NavigationActions, StackActions } from 'react-navigation';
import _ from 'lodash';

import { store } from '../../../frontend_service/store';
import { medicalCaseStatus } from '../../../frontend_service/constants';
import { updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';
import Database from '../api/Database';

let _navigator;

/**
 * Set ref to navigator
 * @param navigatorRef : ref of navigator (from AppContainer -> layout.template.js)
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

/**
 * Navigate to a specific route
 * This method is used when we dont have access to Navigation Context
 *
 * @param routeName : string : route
 * @param params : object : params to pass to navigation
 */
function navigate(routeName, params = {}) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

/**
 * Get the active route string name from react-navigation
 *
 * @param navigationState: Navigation : The state of react-navigation
 * @return : string : the current route
 */
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

/**
 * Set params for the current screen
 * Get the date node and set has a params
 * Will be update on react-navigation v4
 * @params : navigation : the current state navigation
 * @params : string : set the title of the page
 */
function setParamsAge(name = '') {
  const state$ = store.getState();
  const { nodes, mobile_config } = state$;

  const left = mobile_config.left_top_question_id !== null ? nodes[mobile_config.left_top_question_id]?.displayValue() : '';
  const first_right = mobile_config.first_top_right_question_id !== null ? nodes[mobile_config.first_top_right_question_id]?.displayValue() : '';
  const second_right = mobile_config.second_top_right_question_id !== null ? nodes[mobile_config.second_top_right_question_id]?.displayValue() : '';

  const headerRight = `${left} | ${first_right} ${second_right}`;
  const currentRoute = getCurrentRoute();

  const action = NavigationActions.setParams({
    ...currentRoute,
    params: { title: name, headerRight },
  });

  _navigator.dispatch(action);
}

/**
 * Get the active route from react-navigation
 *
 * @return : object : the current route
 */
function getCurrentRoute() {
  if (_navigator === undefined) {
    return null;
  }
  let route = _navigator?.state.nav;

  let index;
  while (route?.routes) {
    index = route.index;
    route = route.routes[route.index];
  }
  if (route !== undefined && route !== null) {
    route.index = index;
  }
  return route;
}

// Try to build reset action stack
function resetActionStack(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName }, params)],
  });

  _navigator.dispatch(resetAction);
}

/**
 * Change the status of the medicalCase depending his status
 *
 * @param prevState: Navigation : The state of react-navigation
 * @param currentState: Navigation : The state of react-navigation
 */

async function onNavigationStateChange(prevState, currentState) {
  const activeRoute = getActiveRouteName(currentState);
  const prev = getActiveRouteName(prevState);
  const currentRoute = getCurrentRoute(currentState);

  // prevent multiple execution
  if (activeRoute !== prev) {
    const state$ = store.getState();

    // This route can change the status of MC
    if (currentRoute.params !== undefined && currentRoute?.params?.medicalCaseStatus !== undefined && state$.status !== currentRoute.params.medicalCaseStatus) {
      const currentStatus = _.find(medicalCaseStatus, (i) => i.name === state$.status);
      const routeStatus = _.find(medicalCaseStatus, (i) => i.name === currentRoute.params.medicalCaseStatus);

      // The status has to be changed !
      if (currentStatus?.index < routeStatus?.index) {
        const database = await new Database();
        await database.update('MedicalCase', state$.id, { status: routeStatus.name });
        // Dispatch an action redux to update the status
        store.dispatch(updateMedicalCaseProperty('status', routeStatus.name));
      }
    }
  }
}

export default {
  setParamsAge,
  onNavigationStateChange,
  resetActionStack,
  navigate,
  setTopLevelNavigator,
  getCurrentRoute,
};
