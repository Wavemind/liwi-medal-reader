// @flow

import React, { Suspense } from 'react';
import { View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import find from 'lodash/find';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

import LiwiLoader from '../../../utils/LiwiLoader';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

const QuestionsPerChiefComplaint = React.lazy(() => import('../../../components/Consultation/QuestionsPerChiefComplaint'));
type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient, nodes },
    } = this.props;

    const age = find(nodes, { reference: '2', category: 'demographic' });

    navigation.setParams({
      title: 'Consultation  ',
      headerRight: `${patient.firstname} ${patient.lastname} | ${age.value} months`,
    });
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
    } = this.props;

    let selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          initialPage={selectedPage}
          validation={false}
          showTopStepper
          showBottomStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          icons={[{ name: 'comment-medical', type: 'FontAwesome5' }, { name: 'ios-body', type: 'Ionicons' }]}
          steps={[t('consultation:medical_history'), t('consultation:physical_exam')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Tests"
          nextStageString={t('medical_case:test')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerChiefComplaint category="medical_history" selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerChiefComplaint category="physical_exam" selectedPage={selectedPage} pageIndex={1} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
        </Stepper>
      </Suspense>
    );
  }
}
