import { NavigationActions, StackActions } from 'react-navigation';
import _ from 'lodash';
import find from 'lodash/find';
import { store } from '../../../frontend_service/store';
import { medicalCaseStatus } from '../../../frontend_service/constants';
import { updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';
import { findById } from '../api/databaseStorage';

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
 * Get the route by the given key
 *
 * @return key : string : the current route key
 * @param state: Navigation : The state of react-navigation
 */
function getActiveRouteByKey(key, state) {
  const { routes } = state;

  for (const route of routes) {
    if (route.key === key.key) {
      return route;
    }
    if (route.routes !== undefined) {
      return getActiveRouteByKey(key, route);
    }
  }
}

/**
 * Get the route by the given name
 *
 * @return name : string : the current route name
 * @param state: Navigation : The state of react-navigation
 */
function getActiveRouteByName(name, state) {
  const { routes } = state;
  for (const route of routes) {
    if (route.routeName === name) {
      return route;
    }
    if (route.routes !== undefined) {
      return getActiveRouteByName(name, route);
    }
  }
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
function setParamsAge(navigation, name) {
  const state$ = store.getState();

  const { getPatient, nodes } = state$;

  const age = find(nodes, { label: 'Age in months' });

  let stringAge;

  if (age !== undefined) {
    stringAge = age.value === null ? 'Age is not defined' : `${age.value} months`;
  } else {
    stringAge = 'No question for age found';
  }

  const headerRight = `${getPatient()?.firstname} ${getPatient()?.lastname} | ${stringAge}`;

  navigation.setParams({
    title: name,
    headerRight,
  });
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

function getRouter(routerName) {
  let route = _navigator.state.nav;
  while (route.routeName !== routerName) {
    route = route.routes[route.index];
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

// eslint-disable-next-line no-unused-vars
/**
 * Change the status of the medicalCase depending his status
 *
 * @param prevState: Navigation : The state of react-navigation
 * @param currentState: Navigation : The state of react-navigation
 */

function onNavigationStateChange(prevState, currentState) {
  const activeRoute = getActiveRouteName(currentState);
  const prev = getActiveRouteName(prevState);
  const cu = getCurrentRoute(currentState);


  // prevent multiple execution
  if (activeRoute !== prev) {
    const state$ = store.getState();

    // This route can change the status of MC
    if (cu.params !== undefined && cu?.params?.medicalCaseStatus !== undefined && state$.status !== cu.params.medicalCaseStatus) {
      // Find index in status
      const currentStatus = _.find(medicalCaseStatus, (i) => {
        return i.name === state$.status;
      });

      // Find index in status
      const routeStatus = _.find(medicalCaseStatus, (i) => {
        return i.name === cu.params.medicalCaseStatus;
      });
      // The status has to be changed !
      if (currentStatus?.index < routeStatus?.index) {
        const medicalCase = findById('MedicalCase', state$.id);
        medicalCase.writeValue('status', routeStatus.name);
        // Dispatch an action redux to update the status
        store.dispatch(updateMedicalCaseProperty('status', routeStatus.name));
      }
    }
  }
}

export default {
  getActiveRouteByKey,
  getActiveRouteByName,
  setParamsAge,
  getActiveRouteName,
  onNavigationStateChange,
  resetActionStack,
  getRouter,
  navigate,
  setTopLevelNavigator,
  getCurrentRoute,
};
