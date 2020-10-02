// @flow

import React, { Suspense } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'native-base';

import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsMedicalHistory, questionsPhysicalExam } from '../../../../frontend_service/algorithm/questionsStage.algo';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import Comment from '../../../components/Comment';

const Stepper = React.lazy(() => import('../../../components/Stepper'));
const QuestionsPerSystem = React.lazy(() => import('../../../components/Consultation/QuestionsPerSystem'));

type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const {
      app: { algorithm },
    } = props;
    NavigationService.setParamsAge(algorithm, 'Consultation');
  }

  render() {
    const {
      app: { t, algorithm },
      focus,
      navigation,
      medicalCase,
    } = this.props;

    const selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
          initialPage={selectedPage}
          validation={false}
          showTopStepper
          showBottomStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          icons={[
            { name: 'comment-medical', type: 'FontAwesome5' },
            { name: 'male', type: 'FontAwesome5' },
            { name: 'comment', type: 'FontAwesome5' },
          ]}
          steps={[t('consultation:medical_history'), t('consultation:physical_exam'), t('consultation:comment')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Tests"
          nextStageString={t('medical_case:test')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <QuestionsPerSystem questions={questionsMedicalHistory(algorithm)} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <QuestionsPerSystem questions={questionsPhysicalExam(algorithm)} selectedPage={selectedPage} pageIndex={1} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <Comment pageIndex={1} selectedPage={selectedPage} comment={medicalCase.comment} />
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
