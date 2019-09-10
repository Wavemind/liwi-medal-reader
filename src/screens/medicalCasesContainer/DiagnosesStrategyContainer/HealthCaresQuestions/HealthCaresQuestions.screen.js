import React from 'react';
import { Text, View } from 'native-base';
import Questions from '../../../../components/QuestionsContainer/Questions';

export default function HealthCaresQuestions(props) {
  const {
    // eslint-disable-next-line react/prop-types
    medicalCase,
    // eslint-disable-next-line react/prop-types
    app: { t },
  } = props;
  // eslint-disable-next-line react/prop-types
  const questions = medicalCase.nodes.getHealthCaresQuestions();

  return (
    <View>
      <Text>{t('medical_case:healthcares_questions')}</Text>
      <Questions questions={questions} />
    </View>
  );
}
