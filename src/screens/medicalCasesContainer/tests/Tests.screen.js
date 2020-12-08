// @flow

import React from 'react';
import { View } from 'native-base';

import { styles } from './Tests.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsTests } from '../../../../frontend_service/algorithm/questionsStage.algo';

const Stepper = React.lazy(() => import('../../../components/Stepper'));
const Questions = React.lazy(() => import('../../../components/QuestionsContainer/Questions'));

export default class Tests extends React.Component {
  constructor(props) {
    super(props);
    const {
      app: { algorithm },
    } = props;
    NavigationService.setParamsAge(algorithm, 'Tests');

    this.state = {
      firstRender: true,
    };
  }

  shouldComponentUpdate(nextProps) {
    const {
      app: { answeredQuestionId },
    } = this.props;
    const { firstRender } = this.state;

    return NavigationService.getCurrentRoute().routeName === 'Tests' && (answeredQuestionId !== nextProps.app.answeredQuestionId || firstRender);
  }

  componentDidMount(): * {
    this.setState({ firstRender: false });
  }

  render() {
    const {
      app: { t, algorithm },
      focus,
      navigation,
    } = this.props;

    return (
      <React.Suspense fallback={<LiwiLoader />}>
        <Stepper
          validation={false}
          showTopStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          initialPage={0}
          showBottomStepper
          icons={[{ name: 'vial', type: 'FontAwesome5' }]}
          steps={[t('medical_case:test')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="DiagnosticsStrategy"
          nextStageString={t('navigation:diagnosticsstrategy')}
        >
          {[
            <View style={styles.pad} key="questions-test">
              {focus === 'didFocus' || focus === 'willFocus' ? (
                <React.Suspense fallback={<LiwiLoader />}>
                  <Questions questions={questionsTests(algorithm)} />
                </React.Suspense>
              ) : (
                <LiwiLoader />
              )}
            </View>,
          ]}
        </Stepper>
      </React.Suspense>
    );
  }
}
