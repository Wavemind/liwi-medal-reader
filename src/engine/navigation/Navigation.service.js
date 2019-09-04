import { NavigationActions, StackActions } from 'react-navigation';
import _ from 'lodash';
import { store } from '../../../frontend_service/store';
import { medicalCaseStatus } from '../../../frontend_service/constants';
import { updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

// Navigate to a specific route
// This method is used when we dont have access to Navigation Context
// Ex : from a function JS or from RxJs
function navigate(routeName, params = {}) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

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

// When we call this method, we get the current route, because the tree from react-navigaton is special
function getCurrentRoute() {
  let route = _navigator.state.nav;

  let index;
  while (route.routes) {
    index = route.index;
    route = route.routes[route.index];
  }
  route.index = index;
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
function onNavigationStateChange(prevState, currentState) {
  // eslint-disable-next-line no-unused-vars
  let activeRoute = getActiveRouteName(currentState);
  let prev = getActiveRouteName(prevState);
  let cu = getCurrentRoute(currentState);

  // prevent multiple execution
  if (activeRoute !== prev) {
    const state$ = store.getState();
    // This route can change the status of MC
    if (
      cu.params !== undefined &&
      cu?.params?.medicalCaseStatus !== undefined &&
      state$.status !== cu.params.medicalCaseStatus
    ) {
      // Find index in status
      let currentStatus = _.find(medicalCaseStatus, (i) => {
        return i.name === state$.status;
      });

      // Find index in status
      let routeStatus = _.find(medicalCaseStatus, (i) => {
        return i.name === cu.params.medicalCaseStatus;
      });
      // The status has to be changed !
      if (currentStatus.index < routeStatus.index) {
        // Dispatch an action redux to update the status
        store.dispatch(updateMedicalCaseProperty('status', routeStatus.name));
      }
    }
  }
}

export default {
  getActiveRouteName,
  onNavigationStateChange,
  resetActionStack,
  getRouter,
  navigate,
  setTopLevelNavigator,
  getCurrentRoute,
};
