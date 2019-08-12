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
  router: Object,
  currentRoute: Object,
  prevRoute: Object,
  beginNavBool: boolean,
  endNavBool: boolean,
  nextRoute: Object,
};
/*
* Component used as a navigator Next / Prev buttons between Triage Vues
* */
export default class NavigationTriage extends React.Component<Props, State> {
  state = {
    router: NavigationService.getrouter('Triage'),
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

  // Init the route
  // Define the next and prev action
  initRouterButton = () => {
    const { router, currentRoute } = this.state;

    let prevRoute;
    let nextRoute;

    let beginNavBool = currentRoute.index === 0;
    let endNavBool = currentRoute.index === router.routes.length - 1;
    let insideNavBool = currentRoute.index !== router.routes.length;

    // Begin Nav Triage OR inside Nav && not at the end
    if ((beginNavBool || insideNavBool) && !endNavBool) {
      nextRoute = router.routes[currentRoute.index + 1];
    }

    // if we are at the end of the triage router
    if (endNavBool) {
      // we are inside the router
      nextRoute = {};
      nextRoute.key = 'MedicalHistory';
    }

    // Inside the router
    if (insideNavBool && !endNavBool) {
      prevRoute = router.routes[currentRoute.index - 1];
    }

    this.setState({
      beginNavBool,
      endNavBool,
      prevRoute,
      nextRoute,
    });
  };

  // Is all the answers of the screen are setter
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

    // Here we can block the next action if not valid
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
