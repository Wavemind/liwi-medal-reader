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
import { Container, Root, StyleProvider } from 'native-base';
import { withApplication } from '../engine/contexts/Application.context';
import NavigationService from '../engine/navigation/Navigation.service';

type Props = {
  app: {
    logged: boolean,
  },
  medicalCase: Object
};

class LayoutTemplate extends React.Component<Props> {

  render() {
    const {
      app: { logged },
      medicalCase,
    } = this.props;

    // Constant used in app
    const Navigator = AppNavigator(logged, medicalCase);
    const AppContainer = createAppContainer(Navigator);
    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);

    return (
      <Root>
        <StyleProvider style={theme}>
          <Container>
            <RootView>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppContainer
                ref={(navigatorRef) => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}

              />
            </RootView>
          </Container>
        </StyleProvider>
      </Root>
    );
  }
}

export default withApplication(LayoutTemplate);
