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
    const { questions, complaintCategory } = this.props;
    if (nextProps.questions.length !== questions.length) {
      return true;
    }

    return complaintCategory.answer !== nextProps.complaintCategory.answer || this.isSomeQuestionsDifferent(nextProps.questions);
  }

  render() {
    const { complaintCategory, questions } = this.props;

    if (complaintCategory.answer === Number(Object.keys(complaintCategory.answers).second()) || complaintCategory.answer === null) {
      return null;
    }

    if (questions.length === 0) {
      return null;
    }

    return (
      <View style={styles.spacingChiefComplaints} key={`complaintCategory_${complaintCategory.id}`}>
        <Text customTitle>{complaintCategory.label}</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
