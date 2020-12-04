// @flow

import React, { Suspense } from 'react';

import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import Comment from '../../../components/Comment';
import MedicalHistory from '../../../components/MedicalHistory';
import PhysicalExam from '../../../components/PhysicalExam';

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
      app: { t },
      navigation,
      medicalCase,
    } = this.props;
    const selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
          params={{ initialPage: 0 }}
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
          <MedicalHistory selectedPage={selectedPage} />
          <PhysicalExam selectedPage={selectedPage} />
          <Comment comment={medicalCase.comment} />
        </Stepper>
      </Suspense>
    );
  }
}
