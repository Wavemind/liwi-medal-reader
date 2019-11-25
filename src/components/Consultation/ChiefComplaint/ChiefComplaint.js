// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './ChiefComplaint.style';
import Questions from '../../QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaint extends React.Component<Props, State> {
  // default settings
  static defaultProps = {
    questions: [],
  };

  isSomeQuestionsDifferent = (nextPropsQuestions) => {
    const { questions } = this.props;
    return questions.some((question) => {
      let nextQuestion = nextPropsQuestions.find((d) => d.id === question.id);
      if (nextQuestion === undefined || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value) {
        return true;
      }
    });
  };

  shouldComponentUpdate(nextProps: Props): boolean {
    // First fast comparaison if the number of questions is different
    const { questions } = this.props;
    if (nextProps.questions.length !== questions.length) {
      return true;
    }

    return this.isSomeQuestionsDifferent(nextProps.questions);
  }

  render() {
    const { chiefComplaint, questions } = this.props;

    if (chiefComplaint.answer === Number(Object.keys(chiefComplaint.answers).second()) || chiefComplaint.answer === null) {
      return null;
    }

    if (questions.length === 0) {
      return null;
    }

    return (
      <View style={styles.spacingChiefComplaints} key={`chiefComplaint_${chiefComplaint.id}`}>
        <Text customTitle>{chiefComplaint.label}</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
