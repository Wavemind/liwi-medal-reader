import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
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

export default {
  getRouteur,
  navigate,
  setTopLevelNavigator,
  getCurrentRoute,
};
