// @flow

import React, { Suspense } from 'react';
import { View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

import { categories } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

const QuestionsPerChiefComplaint = React.lazy(() =>
  import('../../../components/Consultation/QuestionsPerChiefComplaint')
);
type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: 'Consultation  ',
      headerRight: patient.lastname + ' ' + patient.lastname,
    });
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
    } = this.props;

    const initialPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          initialPage={initialPage}
          validation={false}
          showTopStepper
          showBottomStepper
          icons={[
            { name: 'comment-medical', type: 'FontAwesome5' },
            { name: 'ios-body', type: 'Ionicons' },
          ]}
          steps={[
            t('consultation:medical_history'),
            t('consultation:physical_exam'),
          ]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Tests"
          nextStageString={t('medical_case:test')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerChiefComplaint
                  filterBy={[
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
                    { by: 'counter', operator: 'more', value: 0 },
                  ]}
                />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerChiefComplaint
                  filterBy={[
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
                    { by: 'counter', operator: 'more', value: 0 },
                  ]}
                />
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
