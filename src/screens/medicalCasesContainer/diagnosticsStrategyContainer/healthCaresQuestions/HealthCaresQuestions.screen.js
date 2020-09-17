// @flow

import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = {};
// Because a function component is causing error from wrappers
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCaresQuestions extends Component<Props, State> {
  shouldComponentUpdate(nextProps, nextState) {
    const { pageIndex } = this.props;

    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }
    return true;
  }

  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;

    const questions = medicalCase.nodes.getHealthCaresQuestions(medicalCase);

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
