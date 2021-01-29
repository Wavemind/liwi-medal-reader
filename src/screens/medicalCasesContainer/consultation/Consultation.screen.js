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

    this.state = {
      firstRender: true,
    };
  }

  shouldComponentUpdate(nextProps) {
    const {
      app: { answeredQuestionId },
      medicalCase,
    } = this.props;
    const { firstRender } = this.state;

    if (firstRender || nextProps.app.answeredQuestionId === undefined || answeredQuestionId === undefined) {
      return true;
    }
    const question = medicalCase.nodes[answeredQuestionId];
    const nextQuestion = nextProps.medicalCase.nodes[nextProps.app.answeredQuestionId];

    return (
      NavigationService.getCurrentRoute().routeName === 'Consultation' && ((question.id !== nextQuestion.id || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value || question.unavailableValue !== nextQuestion.unavailableValue))
    );
  }

  componentDidMount() {
    this.setState({ firstRender: false });
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
          nextStageString={t('medical_case:tests')}
        >
          <MedicalHistory selectedPage={selectedPage} />
          <PhysicalExam selectedPage={selectedPage} />
          <Comment comment={medicalCase.comment} />
        </Stepper>
      </Suspense>
    );
  }
}
