// @flow

import React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { View } from 'native-base';
import { styles } from './Tests.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsTests } from '../../../../frontend_service/algorithm/questionsStage.algo';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

const Questions = React.lazy(() => import('../../../components/QuestionsContainer/Questions'));
type Props = NavigationScreenProps & {};
type State = {};

// eslint-disable-next-line react/prefer-stateless-function
// Because a function component is causing error from wrappers
export default class Tests extends React.Component<Props, State> {
  componentDidMount() {
    const { navigation } = this.props;
    NavigationService.setParamsAge(navigation, 'Tests');
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
    } = this.props;

    return (
      <React.Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          validation={false}
          showTopStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          initialPage={0}
          showBottomStepper
          icons={[{ name: 'test-tube', type: 'MaterialCommunityIcons' }]}
          steps={[t('medical_case:test')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="DiagnosticsStrategy"
          nextStageString={t('navigation:diagnosticsstrategy')}
        >
          {[
            <View style={styles.pad} key="questions-test">
              {focus === 'didFocus' || focus === 'willFocus' ? (
                <React.Suspense fallback={null}>
                  <Questions questions={questionsTests()} />
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
