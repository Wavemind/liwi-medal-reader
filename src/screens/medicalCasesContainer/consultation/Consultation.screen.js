// Flow

import React, { lazy, Suspense } from 'react';
import { View, Text } from 'native-base';

import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

import { categories, stage } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';

const QuestionsPerChiefComplaint = React.lazy(() =>
  import('../../../components/Consultation/QuestionsPerChiefComplaint')
);

export default class Consultation extends React.Component {
  render() {
    const {
      app: { t },
      medicalCase,
      focus,
    } = this.props;

    console.log('Render consultation Screen', this.props);

    return (
      <Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
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
          backButtonTitle="BACK"
          nextButtonTitle="NEXT"
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
                      by: 'stage',
                      operator: 'equal',
                      value: stage.consultation,
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
                      value: categories.exposure,
                    },
                    {
                      by: 'category',
                      operator: 'equal',
                      value: categories.other,
                    },
                    {
                      by: 'stage',
                      operator: 'equal',
                      value: stage.consultation,
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
