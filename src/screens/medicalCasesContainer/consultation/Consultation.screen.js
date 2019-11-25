// @flow

import React, { Suspense } from 'react';
import { View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

import LiwiLoader from '../../../utils/LiwiLoader';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

const QuestionsPerChiefComplaint = React.lazy(() => import('../../../components/Consultation/QuestionsPerChiefComplaint'));
type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    selectedPage: this.props.navigation.getParam('initialPage'),
  };

  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: 'Consultation  ',
      headerRight: patient.firstname + ' ' + patient.lastname,
    });
  }

  render() {
    const {
      app: { t },
      focus,
    } = this.props;

    const { selectedPage } = this.state;

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
          onPageSelected={(e) => this.setState({ selectedPage: e })}
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
          <View>
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
