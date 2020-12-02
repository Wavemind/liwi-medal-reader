// @flow

import React, { Component } from 'react';
import { Text, View } from 'native-base';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { healthCaresGetQuestions } from '../../../../../frontend_service/helpers/HealthCares.model';

export default class HealthCaresQuestions extends Component {
  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 1;
  }

  render() {
    const {
      medicalCase,
      app: { t, algorithm },
    } = this.props;

    const questions = healthCaresGetQuestions(algorithm, medicalCase);

    return (
      <View>
        {Object.keys(questions).length > 0 ? (
          <Questions questions={questions} />
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('work_case:no_questions')}</Text>
          </View>
        )}
      </View>
    );
  }
}
