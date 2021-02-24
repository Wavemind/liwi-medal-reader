// @flow

import * as React from 'react';
import { createAppContainer } from 'react-navigation';

import getTheme from 'template/liwi/native_components/index.ignore';
import material from 'template/liwi/variables/material';
import liwi from 'template/liwi/styles';
import merge from 'deepmerge';
import { RootView } from 'template/layout';
import { Container, Root, StyleProvider } from 'native-base';
import { withApplication } from '../engine/contexts/Application.context';
import NavigationService from '../engine/navigation/Navigation.service';
import LiwiLoader from '../utils/LiwiLoader';
import { getItem, setItem } from '../engine/api/LocalStorage';
import { navigationRoute, navigationStateKey } from '../../frontend_service/constants';
import { RootMainNavigator } from '../engine/navigation/Root.navigation';
import StatusIndicator from '../components/StatusIndicator';
import Database from '../engine/api/Database';

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
      wasConnected: true,
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

  /**
   * Send fail safe data when connection lost on client server architecture
   * @returns {Promise<void>}
   * @private
   */
  _sendFailSafeData = async () => {
    const database = await new Database();
    const patients = await database.realmInterface.getAll('Patient');
    const success = await database.httpInterface.synchronizePatients(patients);

    // TODO: It's not me and improve this shit
    if (success === 'Synchronize success') {
      database.realmInterface.delete(patients);
    }
  };

  /**
   * Handle connection change and process data send
   * @returns {Promise<void>}
   */
  connectionHandler = async () => {
    const { wasConnected } = this.state;
    const {
      app: { isConnected, session },
    } = this.props;

    if (session?.facility?.architecture === 'client_server') {
      if (!isConnected && wasConnected) {
        this.setState({ wasConnected: !wasConnected });
      } else if (isConnected && !wasConnected) {
        await this._sendFailSafeData();
        this.setState({ wasConnected: !wasConnected });
      }

      await setItem('isConnected', isConnected);
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
      app: { logged, ready },
    } = this.props;

    const { AppContainer, navigationState, mustSetNavigation } = this.state;
    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);

    this.connectionHandler();

    return (
      <>
        <Root>
          <StyleProvider style={theme}>
            {ready ? (
              <Container>
                <RootView>
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
      </>
    );
  }
}

export default withApplication(LayoutTemplate);
