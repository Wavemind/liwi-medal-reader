// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { Suspense } from 'react';
import { SectionList } from 'react-native';

import { styles } from './MedicalHistory.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { questionsMedicalHistory } from '../../../frontend_service/algorithm/questionsStage.algo';
import QuestionFactory from '../QuestionsContainer/QuestionFactory';
import NavigationService from '../../engine/navigation/Navigation.service';
import { translateText } from '../../utils/i18n';

export default class MedicalHistory extends React.Component {
  constructor() {
    super();
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
      (nextProps.selectedPage === undefined || nextProps.selectedPage === 0) &&
      NavigationService.getCurrentRoute().routeName === 'Consultation' &&
      (question.id !== nextQuestion.id || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value || question.unavailableValue !== nextQuestion.unavailableValue)
    );
  }

  componentDidMount() {
    this.setState({ firstRender: false });
  }

  render() {
    const {
      app: { algorithm, answeredQuestionId, algorithmLanguage },
    } = this.props;

    const medicalHistorySystem = questionsMedicalHistory(algorithm, answeredQuestionId);
    const questions = medicalHistorySystem.filter((system) => system.data.length > 0);

    return (
      <View style={styles.pad}>
        <Suspense fallback={<LiwiLoader />}>
          <SectionList
            sections={questions}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <QuestionFactory question={item} key={`${item.id}_factory`} {...this.props} />}
            renderSectionHeader={({ section: { title } }) => <Text customTitle>{translateText(algorithm.config.systems_translations[title], algorithmLanguage)}</Text>}
          />
        </Suspense>
      </View>
    );
  }
}
