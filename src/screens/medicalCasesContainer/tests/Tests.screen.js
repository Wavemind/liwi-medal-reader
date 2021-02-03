// @flow

import React from 'react';
import { Button, Text, View } from 'native-base';

import { styles } from './Tests.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsTests } from '../../../../frontend_service/algorithm/questionsStage.algo';

const Stepper = React.lazy(() => import('../../../components/Stepper'));
const Questions = React.lazy(() => import('../../../components/QuestionsContainer/Questions'));

export default class Tests extends React.Component {
  constructor(props) {
    super(props);
    const {
      app: { algorithm },
    } = props;
    NavigationService.setParamsAge(algorithm, 'Tests');

    this.state = {
      firstRender: true,
    };
  }

  /**
   * Shows the button to reset the stage
   * @returns {JSX.Element}
   */
  renderReset() {
    const {
      app: { t },
    } = this.props;

    return (
      <View>
        <Button block onPress={() => this.resetState()}>
          <Text size-auto>{t('medical_case:reset_stage')}</Text>
        </Button>
      </View>
    );
  }

  /**
   * Loads the medical case from the database in order to reset all edits that are not saved
   * @returns {Promise<void>}
   */
  async resetState() {
    const {
      setMedicalCase,
      medicalCase,
      app: { database },
    } = this.props;
    const newMedicalCase = await database.findBy('MedicalCase', medicalCase.id);
    await setMedicalCase({ ...newMedicalCase, patient: medicalCase.patient });
  }

  shouldComponentUpdate(nextProps) {
    const {
      app: { answeredQuestionId },
      medicalCase,
    } = this.props;
    const { firstRender } = this.state;

    if (firstRender) {
      return true;
    }

    const question = medicalCase.nodes[answeredQuestionId];
    const nextQuestion = nextProps.medicalCase.nodes[nextProps.app.answeredQuestionId];

    return (
      NavigationService.getCurrentRoute().routeName === 'Tests' ||
      (!firstRender && (firstRender || question.id !== nextQuestion.id || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value || question.unavailableValue !== nextQuestion.unavailableValue))
    );
  }

  componentDidMount() {
    this.setState({ firstRender: false });
  }

  render() {
    const {
      app: { t, algorithm },
      navigation,
    } = this.props;

    return (
      <React.Suspense fallback={<LiwiLoader />}>
        <Stepper
          validation={false}
          showTopStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          initialPage={0}
          showBottomStepper
          icons={[{ name: 'vial', type: 'FontAwesome5' }]}
          steps={[t('medical_case:tests')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="DiagnosticsStrategy"
          nextStageString={t('navigation:diagnosticsstrategy')}
        >
          {[
            <View style={styles.pad} key="questions-test">
              <React.Suspense fallback={<LiwiLoader />}>
                <Questions questions={questionsTests(algorithm)} />
              </React.Suspense>
              {algorithm.is_arm_control && this.renderReset()}
            </View>,
          ]}
        </Stepper>
      </React.Suspense>
    );
  }
}
