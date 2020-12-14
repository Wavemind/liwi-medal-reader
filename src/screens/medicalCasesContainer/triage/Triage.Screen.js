// @flow

import React, { Suspense } from 'react';
import { Content, View } from 'native-base';

import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsComplaintCategory, questionsFirstLookAssessment } from '../../../../frontend_service/algorithm/questionsStage.algo';
import Boolean from '../../../components/QuestionsContainer/DisplaysContainer/Boolean';
import BasicMeasurements from '../../../components/BasicMeasurements';
import Questions from '../../../components/QuestionsContainer/Questions';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

export default class Triage extends React.Component {
  constructor(props) {
    super(props);

    const {
      app: { t, algorithm },
    } = props;

    NavigationService.setParamsAge(algorithm, 'Triage');

    const icons = [
      { name: 'heartbeat', type: 'FontAwesome5' },
      { name: 'stethoscope', type: 'FontAwesome5' },
      { name: 'thermometer', type: 'FontAwesome5' },
    ];

    const steps = [t('triage:first_look_assessment'), t('triage:chief'), t('triage:basic_measurement')];

    // Remove health cares questions if we're in arm control
    if (algorithm.is_arm_control) {
      icons.splice(1, 1); // first_look_assessment
      steps.splice(1, 1); // first_look_assessment
    }

    this.state = {
      icons,
      steps,
      complaintCategories: [],
      firstRender: true,
    };
  }

  shouldComponentUpdate(nextProps) {
    const {
      app: { answeredQuestionId },
    } = this.props;
    const { firstRender } = this.state;

    return NavigationService.getCurrentRoute().routeName === 'Triage' && (answeredQuestionId !== nextProps.app.answeredQuestionId || firstRender);
  }

  componentDidMount() {
    const {
      app: { algorithm },
    } = this.props;

    this.setState({ complaintCategories: questionsComplaintCategory(algorithm), firstRender: false });
  }

  render() {
    const {
      app: { t, algorithm },
      navigation,
    } = this.props;

    const { complaintCategories, icons, steps } = this.state;

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
          icons={icons}
          steps={steps}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage={algorithm.is_arm_control ? 'Tests' : 'Consultation'}
          nextStageString={algorithm.is_arm_control ? t('medical_case:test') : t('medical_case:consultation')}
        >
          {algorithm.is_arm_control ? null : (
            <View style={styles.pad}>
              <Suspense fallback={<LiwiLoader />}>
                <Questions questions={questionsFirstLookAssessment(algorithm)} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            </View>
          )}
          <View style={styles.flex}>
            <Suspense fallback={<LiwiLoader />}>
              <Content>
                <View flex-container-fluid>
                  {complaintCategories.map((question, i) => (
                    <Boolean key={`${question.id}_chief_boolean`} question={question} index={i} />
                  ))}
                </View>
              </Content>
            </Suspense>
          </View>
          <BasicMeasurements selectedPage={selectedPage} />
        </Stepper>
      </Suspense>
    );
  }
}
