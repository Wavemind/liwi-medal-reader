// @flow

import React, { Component } from 'react';
import { View } from 'native-base';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { styles } from './HealthCaresQuestions.style';
import { healthCaresGetQuestions } from '../../../../../frontend_service/helpers/HealthCares.model';

export default class HealthCaresQuestions extends Component {
  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 1;
  }

  render() {
    const {
      medicalCase,
      app: { algorithm },
    } = this.props;

    const questions = healthCaresGetQuestions(algorithm, medicalCase);

    return (
      <View style={styles.flex}>
        <Questions questions={questions} />
      </View>
    );
  }
}
