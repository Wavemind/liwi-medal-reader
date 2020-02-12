// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './System.style';
import Questions from '../../QuestionsContainer/Questions';
import { systems } from '../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class System extends React.Component<Props, State> {
  // default settings
  static defaultProps = {
    questions: [],
  };

  // Compare the new props to old props for optimization
  // Return true if one question is different
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
    const { system, questions } = this.props;

    if (questions.length === 0) {
      return null;
    }

    return (
      <View style={styles.spacingChiefComplaints} key={`view_system_${system}`}>
        <Text customTitle>{systems[system]}</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
