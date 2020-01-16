// @flow
/* eslint-disable react/no-unused-state*/
import * as React from 'react';
import NavigationService from '../navigation/Navigation.service';
import { store } from '../../../frontend_service/store';

const defaultValue = {};
const PoliceOfficerContext = React.createContext<Object>(defaultValue);

type PoliceOfficerProviderProps = {};

export type PoliceOfficerProviderState = {};

export class PoliceOfficerProvider extends React.Component<PoliceOfficerProviderProps, PoliceOfficerProviderState> {
  screens = [
    { key: 'Home' },
    { key: 'PatientUpsert', medicalCaseOrder: 0 },
    { key: 'Triage', medicalCaseOrder: 1 },
    { key: 'Consultation', medicalCaseOrder: 2 },
  ];

  navigation = {
    activeRouteName: null,
    prevRouteName: null,
    activeRoute: null,
    prevRoute: null,
  };

  constructor(props: PoliceOfficerProviderProps) {
    super(props);
  }

  // Set value in context
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  setNavigation = (prevState, currentState, action) => {
    console.log(action);
    const activeRoute = NavigationService.getCurrentRoute(currentState);

    const activeRouteName = NavigationService.getActiveRouteName(currentState);

    const prevRouteName = NavigationService.getActiveRouteName(prevState);

    if (activeRouteName !== this.navigation.activeRouteName && activeRouteName !== prevRouteName) {
      // Specific code for get prevRoute
      const prevRoute = NavigationService.getActiveRouteByName(prevRouteName, prevState);

      // this.setState({ activeRouteName, prevRouteName });
      this.navigation = { activeRouteName: activeRouteName, activeRoute: activeRoute, prevRouteName: prevRouteName, prevRoute: prevRoute };
    }
  };

  policeOfficerControl = () => {
    let state$ = store.getState();

    const { activeRouteName, prevRoute } = this.navigation;
    const detailActiveRoute = this.screens.find((s) => s.key === activeRouteName);


    if (activeRouteName === null) {
      return true;
    }

    /*** Specific Validation ***/

    // the case is still in creation, do not permit to go into medical case
    if (detailActiveRoute.medicalCaseOrder > 0 && state$.isNewCase === true) {
      NavigationService.navigate(prevRoute.routeName, prevRoute.params);
      return false;
    }
  };

  state = {
    set: this.setValState,
    setNavigation: this.setNavigation,
    policeOfficerControl: this.policeOfficerControl,
    prevNavigationState: null,
    currentNavigationState: null,
    navigation: this.navigation,
  };

  render() {
    const { children } = this.props;
    return <PoliceOfficerContext.Provider value={this.state}>{children}</PoliceOfficerContext.Provider>;
  }
}

export const withPoliceOfficer = (Component: React.ComponentType<any>) => (props: any) => (
  <PoliceOfficerContext.Consumer>
    {(store) => {
      store.policeOfficerControl();
      return <Component police={store} {...props} />;
    }}
  </PoliceOfficerContext.Consumer>
);
