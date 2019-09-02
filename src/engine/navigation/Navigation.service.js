import { NavigationActions, StackActions } from 'react-navigation';

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
function onNavigationStateChange(prevState, currentState, action) {

  // eslint-disable-next-line no-unused-vars
  let current = getActiveRouteName(currentState);

  // here update statu of medicalcase in the case of entering route name

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
