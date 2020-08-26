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

export default class Tests extends React.Component<Props, State> {
  componentDidMount() {
    NavigationService.setParamsAge('Tests');
  }

  render() {
    const {
      app: { t },
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
