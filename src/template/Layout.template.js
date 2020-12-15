// @flow

import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { NetworkProvider } from 'react-native-offline';

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
import { navigationRoute, navigationStateKey, secondStatusLocalData } from '../../frontend_service/constants';
import { RootMainNavigator } from '../engine/navigation/Root.navigation';
import StatusIndicator from '../components/StatusIndicator';

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
  const route = NavigationService.getCurrentRoute();

  try {
    // Dont set route if login process
    if (!route.routeName.match(/UserSelection|UnlockSession|NewSession/)) {
      await setItem(navigationRoute, route);
      await setItem(navigationStateKey, navState);
    }
  } catch (err) {
    // handle the error according to your needs
  }
};

class LayoutTemplate extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      prevRoute: null,
      mustSetNavigation: false,
      navigationState: null,
      AppContainer: createAppContainer(RootMainNavigator),
    };
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return nextProps.app.appState !== 'background';
  }

  updatePrevRoute = async () => {
    const { prevRoute } = this.state;
    const r = await getItem(navigationRoute);
    const navigationState = await getItem(navigationStateKey);
    const currentRoute = NavigationService.getCurrentRoute();

    if (currentRoute !== null && currentRoute !== undefined && r !== null) {
      if (currentRoute.key !== r.key && prevRoute?.key !== r.key) {
        this.setState({ prevRoute: r, navigationState, mustSetNavigation: true });
      }
    }
  };

  async componentDidMount() {
    await this.updatePrevRoute();
  }

  async componentDidUpdate() {
    await this.updatePrevRoute();
  }

  render() {
    const {
      app: { logged, ready, session },
    } = this.props;

    const { AppContainer, navigationState, mustSetNavigation } = this.state;
    let serverURL = '';
    let isStandalone = false;
    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);
    console.log(this.props);
    console.log(session)

    if (session !== null) {
      isStandalone = session.facility.architecture === 'standalone';
      if (!isStandalone) {
        serverURL = session.facility.local_data_ip;
      }
    }

    console.log('shouldPing', !isStandalone)
    console.log('serverURL', serverURL)

    return (
      <NetworkProvider shouldPing={!isStandalone} pingServerUrl={serverURL} pingInterval={secondStatusLocalData}>
        <Root>
          <StyleProvider style={theme}>
            {ready ? (
              <Container>
                <RootView>
                  {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                  <AppContainer
                    mustSetNavigation={mustSetNavigation}
                    updateMustSetNavigation={() => this.setState({ mustSetNavigation: false })}
                    navigationState={navigationState}
                    logged={logged}
                    persistNavigationState={persistNavigationState}
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
        <StatusIndicator />
      </NetworkProvider>
    );
  }
}

export default withApplication(LayoutTemplate);
