import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params = {}) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

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

function getRouteur(routeurName) {
  let route = _navigator.state.nav;
  while (route.routeName !== routeurName) {
    route = route.routes[route.index];
  }
  return route;
}

function resetActionStack(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName }, params)],
  });

  _navigator.dispatch(resetAction);
}

export default {
  resetActionStack,
  getRouteur,
  navigate,
  setTopLevelNavigator,
  getCurrentRoute,
};
