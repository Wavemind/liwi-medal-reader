// @flow

import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import getTheme from 'template/liwi/native_components/index.ignore';
import material from 'template/liwi/variables/material';
import liwi from 'template/liwi/styles';
import merge from 'deepmerge';
import { RootView } from 'template/layout';
import { Platform, StatusBar } from 'react-native';
import { Container, Root, StyleProvider } from 'native-base';
import { withApplication } from '../engine/contexts/Application.context';
import NavigationService from '../engine/navigation/Navigation.service';
import LiwiLoader from '../utils/LiwiLoader';
import { getItem, setItem } from '../engine/api/LocalStorage';
import { appInBackgroundStateKey, navigationStateKey } from '../../frontend_service/constants';
import CustomNavigator from '../engine/navigation/CustomNavigator.navigation';
import { RootLoginNavigator } from '../engine/navigation/Root.navigation';

type Props = {
  app: {
    logged: boolean,
    ready: boolean,
    appState: string,
    navigationState: Array,
  },
};

// eslint-disable-next-line no-unused-vars
const persistNavigationState = async (navState) => {
  try {
    await setItem(navigationStateKey, navState);
  } catch (err) {
    // handle the error according to your needs
  }
};

class LayoutTemplate extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props): boolean {
    return nextProps.app.appState !== 'background';
  }

  loadNavigationState = async () => {
    const state = await getItem(navigationStateKey);
    const fromBackground = await getItem(appInBackgroundStateKey);
    const {
      app: { appState },
    } = this.props;

    let routes = null;

    // If the app come not from the background the item is set in app.context
    if (fromBackground === null && appState === 'active') {
      // first render of the app
      return null;
    }
    if (fromBackground && appState === 'active') {
      routes = state;
      const { app } = this.props;

      // This fix a bug when we reload the app in the userselection screen
      if (routes !== null && routes.routes[routes.index].key.match(/UserSelection|SetCodeSession/) && app.logged === true) {
        routes = null;
      }
      // Set the flag background
      await setItem(appInBackgroundStateKey, null);
      return routes;
    }
  };

  render() {
    const {
      app: { logged, ready, session },
    } = this.props;

    // Constant used in app
    let AppContainer;

    if (logged) {
      AppContainer = createAppContainer(CustomNavigator);
    } else {
      let routeName = '';
      if (session !== null) {
        if (session.group === null) {
          routeName = 'NewSession';
        } else {
          routeName = 'UnlockSession';
        }
      }
      AppContainer = createAppContainer(RootLoginNavigator(routeName));
    }

    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);

    return (
      <Root>
        <StyleProvider style={theme}>
          {ready ? (
            <Container>
              <RootView>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <AppContainer
                  logged={logged}
                  persistNavigationState={persistNavigationState}
                  // loadNavigationState={this.loadNavigationState}
                  renderLoadingExperimental={() => <LiwiLoader />}
                  ref={(navigatorRef) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                  onNavigationStateChange={(prevState, currentState) => {
                    NavigationService.onNavigationStateChange(prevState, currentState);
                  }}
                />
              </RootView>
            </Container>
          ) : (
            <LiwiLoader />
          )}
        </StyleProvider>
      </Root>
    );
  }
}

export default withApplication(LayoutTemplate);
