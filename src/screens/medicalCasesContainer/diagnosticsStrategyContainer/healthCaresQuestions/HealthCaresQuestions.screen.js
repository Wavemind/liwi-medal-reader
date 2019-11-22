// @flow

import React, { Component } from 'react';
import { View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = {};
// Because a function component is causing error from wrappers
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCaresQuestions extends Component<Props, State> {
  render() {
    const {
      medicalCase,
    } = this.props;
    const questions = medicalCase.nodes.getHealthCaresQuestions();

    return (
      <View>
        <Questions questions={questions} />
      </View>
    );
  }
}
