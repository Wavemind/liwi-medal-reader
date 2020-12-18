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

export default class MedicalHistory extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      app: { answeredQuestionId },
      medicalCase,
    } = this.props;

    const question = medicalCase.nodes[answeredQuestionId];
    const nextQuestion = nextProps.medicalCase.nodes[nextProps.app.answeredQuestionId];

    // console.log("sinan", JSON.parse(JSON.stringify(nextProps.medicalCase.nodes)))

    console.log(
      'medicalHistory',
      (nextProps.selectedPage === undefined || nextProps.selectedPage === 0) &&
        NavigationService.getCurrentRoute().routeName === 'Consultation' &&
        (question.id !== nextQuestion.id || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value)
    );

    return (
      (nextProps.selectedPage === undefined || nextProps.selectedPage === 0) &&
      NavigationService.getCurrentRoute().routeName === 'Consultation' &&
      (question.id !== nextQuestion.id || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value)
    );
  }

  render() {
    const {
      app: { algorithm, answeredQuestionId },
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
            renderSectionHeader={({ section: { title } }) => <Text customTitle>{algorithm.config.systems_translations[title]}</Text>}
          />
        </Suspense>
      </View>
    );
  }
}
