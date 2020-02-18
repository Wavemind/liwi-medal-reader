// @flow

import * as React from 'react';
import { Button, Icon, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { styles } from '../../../engine/navigation/drawer/Drawer.style';
import { stage } from '../../../../frontend_service/constants';

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
/**
 * Component used as a navigator Next / Prev buttons between Triage Vues
 * */
export default class NavigationTriage extends React.Component<Props, State> {
  state = {
    router: ['FirstLookAssessments', 'ChiefComplaints', 'BasicMeasurements', 'MedicalHistory', 'PhysicalExam', 'Tests', 'DiagnosticsStrategy'],
    currentRoute: NavigationService.getCurrentRoute(),
    prevRoute: {},
    beginNavBool: false,
    endNavBool: false,
    nextRoute: {},
  };

  static defaultProps = {
    questionsInScreen: [],
  };

  componentDidMount() {
    this.initRouter();
  }

  /**
   * Sets in the state the next and prev action for the current screen
   **/
  initRouter = () => {
    const { router, currentRoute } = this.state;

    let prevRoute;
    let nextRoute;

    let indexInRouter = router.findIndex((e) => e === currentRoute.routeName);

    let beginNavBool = currentRoute.key === router.first();
    let endNavBool = currentRoute.key === router.last();
    let insideNavBool = indexInRouter !== router.length;

    // Begin Nav Triage OR inside Nav && not at the end
    if ((beginNavBool || insideNavBool) && !endNavBool) {
      nextRoute = router[indexInRouter + 1];
    }

    // If we are at the end of the stage router
    if (endNavBool) {
      nextRoute = {};
      nextRoute.key = 'MedicalHistory';
    }

    // Inside the router
    if (insideNavBool) {
      prevRoute = router[indexInRouter - 1];
    }

    this.setState({
      beginNavBool,
      endNavBool,
      prevRoute,
      nextRoute,
    });
  };

  /**
   * Return true if all question have been answered
   * @return [Boolean]
   **/
  isScreenValid = () => {
    const { medicalCase, questionsInScreen } = this.props;
    const { endNavBool } = this.state;

    if (questionsInScreen.length === 0) {
      return true;
    }

    // Verify if all questions of triage stage is answered
    if (endNavBool) {
      const triageQuestions = medicalCase.nodes.filterByStage(stage.triage);
      return medicalCase.nodes.isAllAnswered(triageQuestions);
    }

    return medicalCase.nodes.isAllAnswered(questionsInScreen);
  };

  /**
   * If the screen is valid it will navigate to the next screen, if not nothing is done
   */
  goToNextScreen = () => {
    const { nextRoute } = this.state;
    const { navigation } = this.props;

    // Blocks the action if the we are not allowed to go to the next screen
    this.isScreenValid() || __DEV__ ? navigation.navigate(nextRoute) : null;
  };

  closeStageStatus = () => {
    const { setStatus, navigation } = this.props;
    const { currentRoute } = this.state;

    setStatus('status', currentRoute?.params?.nextStage);
    navigation.navigate('MedicalCaseList');
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    const { state } = this;
    return (
      state.beginNavBool !== nextState.beginNavBool ||
      state.endNavBool !== nextState.endNavBool ||
      state.prevRoute !== nextState.prevRoute ||
      state.nextRoute !== nextState.nextRoute
    );
  }

  render() {
    const { prevRoute, beginNavBool, endNavBool, currentRoute } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

    return (
      <View bottom-view columns marginTop>
        <Button light split disabled={beginNavBool} onPress={() => navigation.navigate(prevRoute)}>
          <Icon style={styles.medicalCaseNavigationIcon} dark type="AntDesign" name="left" />
          <Text>{t('form:back')}</Text>
        </Button>
        {currentRoute?.params?.nextStage ? (
          <Button split onPress={this.closeStageStatus}>
            <Icon style={styles.rightMedicalCaseNavigationIcon} dark type="AntDesign" name="closecircleo" />
            <Text>{t('form:finish')}</Text>
          </Button>
        ) : null}
        <Button success split onPress={this.goToNextScreen}>
          {!endNavBool ? <Text>{t('form:next')}</Text> : <Text>{t('form:next_stage')}</Text>}
          <Icon style={styles.rightMedicalCaseNavigationIcon} dark type="AntDesign" name="right" />
        </Button>
      </View>
    );
  }
}
