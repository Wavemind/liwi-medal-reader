// @flow

import React, { Suspense } from 'react';
import { View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

import LiwiLoader from '../../../utils/LiwiLoader';
import { categories } from '../../../../frontend_service/constants';
import NavigationService from '../../../engine/navigation/Navigation.service';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

const QuestionsPerSystem = React.lazy(() => import('../../../components/Consultation/QuestionsPerSystem'));

type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  componentWillMount() {
    const { navigation } = this.props;

    NavigationService.setParamsAge(navigation, 'Consultation');
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
      medicalCase,
    } = this.props;

    let selectedPage = navigation.getParam('initialPage');

    // Filter questions medical history
    let medical_history = medicalCase.nodes.filterBy(
      [
        {
          by: 'category',
          operator: 'equal',
          value: categories.symptom,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.exposure,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.vitalSignTriage,
        },
      ],
      'OR',
      'array',
      false
    );

    // Filter questions physical exam
    let physical_exam = medicalCase.nodes.filterBy(
      [
        {
          by: 'category',
          operator: 'equal',
          value: categories.physicalExam,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.other,
        },
      ],
      'OR',
      'array',
      false
    );

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
                <QuestionsPerSystem questions={medical_history} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerSystem questions={physical_exam} selectedPage={selectedPage} pageIndex={1} />
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
