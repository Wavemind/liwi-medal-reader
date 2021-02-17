// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { Suspense } from 'react';
import { SectionList } from 'react-native';

import { styles } from './PhysicalExam.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { questionsPhysicalExam } from '../../../frontend_service/algorithm/questionsStage.algo';
import QuestionFactory from '../QuestionsContainer/QuestionFactory';
import NavigationService from '../../engine/navigation/Navigation.service';

export default class PhysicalExam extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      app: { answeredQuestionId },
      medicalCase,
    } = this.props;

    if (nextProps.app.answeredQuestionId === undefined || answeredQuestionId === undefined) {
      return true;
    }

    const question = medicalCase.nodes[answeredQuestionId];
    const nextQuestion = nextProps.medicalCase.nodes[nextProps.app.answeredQuestionId];

    return (
      nextProps.selectedPage !== this.props.selectedPage ||
      ((nextProps.selectedPage === undefined || nextProps.selectedPage === 1) &&
        NavigationService.getCurrentRoute().routeName === 'Consultation' &&
        (question.id !== nextQuestion.id || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value || question.unavailableValue !== nextQuestion.unavailableValue))
    );
  }

  render() {
    const {
      app: { algorithm, answeredQuestionId },
    } = this.props;

    const physicalExamSystem = questionsPhysicalExam(algorithm, answeredQuestionId);
    const questions = physicalExamSystem.filter((system) => system.data.length > 0);

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
