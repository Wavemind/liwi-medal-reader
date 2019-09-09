import React from 'react';
import { Text, View } from 'native-base';
import Questions from '../../../../components/QuestionsContainer/Questions';

export default function HealthCaresQuestions(props) {
  // eslint-disable-next-line react/prop-types
  const { medicalCase } = props;
  // eslint-disable-next-line react/prop-types
  const questions = medicalCase.nodes.getHealthCaresQuestions();

  return (
    <View>
      <Text>HealthCaresQuestions</Text>
      <Questions questions={questions} />
    </View>
  );
}
