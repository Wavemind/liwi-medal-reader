// @flow

import React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { View } from 'native-base';
import { categories } from '../../../../frontend_service/constants';
import { styles } from './Tests.style';
import LiwiLoader from '../../../utils/LiwiLoader';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

// import Questions from '../../../components/QuestionsContainer/Questions';

const Questions = React.lazy(() =>
  import('../../../components/QuestionsContainer/Questions')
);
type Props = NavigationScreenProps & {};
type State = {};

// eslint-disable-next-line react/prefer-stateless-function
// Because a function component is causing error from wrappers
export default class Tests extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: 'Tests ',
      headerRight: patient.firstname + ' ' + patient.lastname,
    });
  }

  render() {
    const {
      medicalCase,
      app: { t },
      focus,
    } = this.props;

    let assessmentTest = medicalCase.nodes.filterBy([
      { by: 'category', operator: 'equal', value: categories.assessment },
    ]);

    return (
      <React.Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          validation={false}
          showTopStepper
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
              {focus === 'didFocus' ? (
                <React.Suspense fallback={null}>
                  <Questions questions={assessmentTest} />
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
