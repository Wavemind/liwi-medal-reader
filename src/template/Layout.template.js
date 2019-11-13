// @flow

import * as React from 'react';
import AppNavigator from 'engine/navigation/Root.navigation';
import { createAppContainer } from 'react-navigation';
import getTheme from 'template/liwi/native_components/index.ignore';
import material from 'template/liwi/variables/material';
import liwi from 'template/liwi/styles';
import merge from 'deepmerge';
import { RootView } from 'template/layout';
import { Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Root, StyleProvider } from 'native-base';
import { withApplication } from '../engine/contexts/Application.context';
import NavigationService from '../engine/navigation/Navigation.service';
import LiwiLoader from '../utils/LiwiLoader';
import { setItem } from '../engine/api/LocalStorage';
import { navigationStateKey } from '../../frontend_service/constants';

type Props = {
  app: {
    logged: boolean,
    ready: boolean,
    navigationState: Array,
  },
};

const loadNavigationState = async () => {
  const jsonString = await AsyncStorage.getItem(navigationStateKey);
  return JSON.parse(jsonString);
};

const persistNavigationState = async (navState) => {
  try {
    await setItem(navigationStateKey, navState);
  } catch (err) {
    // handle the error according to your needs
  }
};

class LayoutTemplate extends React.Component<Props> {
  render() {
    const {
      app: { logged, ready },
    } = this.props;

    // Constant used in app
    const Navigator = AppNavigator(logged);
    const AppContainer = createAppContainer(Navigator);
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
                  persistNavigationState={persistNavigationState}
                  loadNavigationState={loadNavigationState}
                  renderLoadingExperimental={() => <LiwiLoader />}
                  ref={(navigatorRef) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                  onNavigationStateChange={NavigationService.onNavigationStateChange}
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
