// @flow

import * as React from 'react';
import AppNavigator from 'engine/navigation/Root.navigation';

import { Platform, StatusBar, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Container, StyleProvider, Root } from 'native-base';
import getTheme from 'template/liwi/native_components/index.ignore';
import material from 'template/liwi/variables/material';
import liwi from 'template/liwi/styles';
import merge from 'deepmerge';
import { RootView } from 'template/layout';
import { withApplication } from '../engine/contexts/Application.context';
import { withSessions } from 'engine/contexts/Sessions.context';

type Props = {
  app: {
    logged: boolean,
  },
};

class LayoutTemplate extends React.Component<Props> {
  render() {
    const {
      app: { logged },
    } = this.props;

    const Navigator = AppNavigator(logged);
    const AppContainer = createAppContainer(Navigator);
    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);

    return (
      <Root>
        <StyleProvider style={theme}>
          <Container>
            <RootView>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppContainer />
            </RootView>
          </Container>
        </StyleProvider>
      </Root>
    );
  }
}

export default withApplication(LayoutTemplate);
