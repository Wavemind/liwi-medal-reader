// @flow

import * as React from 'react';
import { Button, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import NavigationService from '../../../engine/navigation/Navigation.service';

type Props = NavigationScreenProps & {
  questionsInScreen: Array,
};

type State = { app: StateApplicationContext } & {
  routeur: Object,
  currentRoute: Object,
  prevRoute: Object,
  beginNavBool: boolean,
  endNavBool: boolean,
  nextRoute: Object,
};

export default class NavigationTriage extends React.Component<Props, State> {
  state = {
    routeur: NavigationService.getRouteur('Triage'),
    currentRoute: NavigationService.getCurrentRoute(),
    prevRoute: {},
    beginNavBool: false,
    endNavBool: false,
    nextRoute: {},
  };

  static defaultProps = {
    questionsInScreen: [],
  };

  componentWillMount() {
    this.initRouterButton();
  }

  initRouterButton = () => {
    const { routeur, currentRoute } = this.state;

    let prevRoute;
    let nextRoute;

    let beginNavBool = currentRoute.index === 0;
    let endNavBool = currentRoute.index === routeur.routes.length - 1;
    let insideNavBool = currentRoute.index !== routeur.routes.length;

    // Begin Nav Triage OR inside Nav && not at the end
    if ((beginNavBool || insideNavBool) && !endNavBool) {
      nextRoute = routeur.routes[currentRoute.index + 1];
    }

    // if we are at the end of the triage routeur
    if (endNavBool) {
      // we are inside the routeur
      nextRoute = {};
      nextRoute.key = 'MedicalHistory';
    }

    // Inside the routeur
    if (insideNavBool && !endNavBool) {
      prevRoute = routeur.routes[currentRoute.index - 1];
    }

    this.setState({
      beginNavBool,
      endNavBool,
      prevRoute,
      nextRoute,
    });
  };

  isNodeValid = () => {
    const { medicalCase, questionsInScreen } = this.props;

    if (questionsInScreen.length === 0) {
      return true;
    }

    return medicalCase.nodes.isAnsweredNodes(questionsInScreen);
  };

  nextScreen = () => {
    const { nextRoute } = this.state;

    const { navigation } = this.props;

    let isValid = this.isNodeValid();

    isValid ? navigation.navigate(nextRoute.key) : null;
  };

  render() {
    const { prevRoute, beginNavBool, endNavBool } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

    return (
      <View bottom-view columns>
        <Button
          light
          split
          disabled={beginNavBool}
          onPress={() => navigation.navigate(prevRoute.key)}
        >
          <Text>{t('form:back')}</Text>
        </Button>
        <Button light split onPress={this.nextScreen}>
          {!endNavBool ? (
            <Text>{t('form:next')}</Text>
          ) : (
            <Text>Next stage MedicalHistory</Text>
          )}
        </Button>
      </View>
    );
  }
}
