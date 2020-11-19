// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { styles } from './System.style';
import Questions from '../../QuestionsContainer/Questions';
import i18n from '../../../utils/i18n';

export default class System extends React.Component {
  // default settings
  static defaultProps = {
    questions: [],
  };

  /**
   * Compare the new props to old props for optimization
   * Return true if one question is different
   * @params nextPropsQuestions : the new object questions
   * @return boolean
   */
  isSomeQuestionsDifferent = (nextPropsQuestions) => {
    const { questions } = this.props;
    return questions.some((question) => {
      const nextQuestion = nextPropsQuestions.find((d) => d.id === question.id);
      if (nextQuestion === undefined || question.answer !== nextQuestion.answer || question.value !== nextQuestion.value) {
        return true;
      }
    });
  };

  shouldComponentUpdate(nextProps: Props): boolean {
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
        <Text customTitle>{i18n.t(`systems:${system}`)}</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
