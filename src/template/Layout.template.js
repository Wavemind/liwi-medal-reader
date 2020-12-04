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
import { RootMainNavigator } from '../engine/navigation/Root.navigation';

class LayoutTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationState: null,
      AppContainer: createAppContainer(RootMainNavigator),
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.app.appState !== 'background';
  }

  render() {
    const {
      app: { logged, ready },
    } = this.props;

    const { AppContainer, navigationState } = this.state;

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
                  navigationState={navigationState}
                  logged={logged}
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
