// @flow

import React, { Suspense } from 'react';
import { Text, View } from 'native-base';

import { ScrollView } from 'react-native';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsMedicalHistory, questionsPhysicalExam } from '../../../../frontend_service/algorithm/questionsStage.algo';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import Comment from '../../../components/Comment';
import System from '../../../components/Consultation/System';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

export default class Consultation extends React.Component {
  constructor(props) {
    super(props);

    const {
      app: { algorithm },
    } = props;
    NavigationService.setParamsAge(algorithm, 'Consultation');
  }

  render() {
    const {
      app: { t, algorithm, answeredQuestionId },
      focus,
      navigation,
      medicalCase,
    } = this.props;

    const selectedPage = navigation.getParam('initialPage');
    const medicalHistorySystem = questionsMedicalHistory(algorithm, answeredQuestionId);
    const physicalExamSystem = questionsPhysicalExam(algorithm, answeredQuestionId);

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
                <ScrollView contentContainerStyle={styles.container}>
                  {Object.keys(medicalHistorySystem).length > 0 ? (
                    Object.keys(medicalHistorySystem).map((keySystem) => <System system={keySystem} key={`system_${keySystem}`} questions={medicalHistorySystem[keySystem]} />)
                  ) : (
                    <View padding-auto margin-auto>
                      <Text not-available>{t('patient_list:not_found')}</Text>
                    </View>
                  )}
                </ScrollView>
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <ScrollView contentContainerStyle={styles.container}>
                  {Object.keys(physicalExamSystem).length > 0 ? (
                    Object.keys(physicalExamSystem).map((keySystem) => <System system={keySystem} key={`system_${keySystem}`} questions={physicalExamSystem[keySystem]} />)
                  ) : (
                    <View padding-auto margin-auto>
                      <Text not-available>{t('patient_list:not_found')}</Text>
                    </View>
                  )}
                </ScrollView>
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
