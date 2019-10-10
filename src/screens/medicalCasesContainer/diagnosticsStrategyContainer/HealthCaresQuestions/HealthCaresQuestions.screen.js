import React, { Component } from 'react';
import { Text, View } from 'native-base';
import Questions from '../../../../components/QuestionsContainer/Questions';

// Because a function component is causing error from wrappers
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCaresQuestions extends Component<{}> {
  render() {
    const {
      // eslint-disable-next-line react/prop-types
      medicalCase,
      // eslint-disable-next-line react/prop-types
      app: { t },
    } = this.props;
    // eslint-disable-next-line react/prop-types
    const questions = medicalCase.nodes.getHealthCaresQuestions();

    return (
      <View>
        <Text>{t('medical_case:healthcares_questions')}</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
