// @flow

import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { NodeModel } from '../../../../../frontend_service/engine/models/Node.model';
import { HealthCaresModel } from '../../../../../frontend_service/engine/models/HealthCares.model';

type Props = NavigationScreenProps & {};
type State = {};
// Because a function component is causing error from wrappers
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCaresQuestions extends Component<Props, State> {
  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 1;
  }

  render() {
    const {
      medicalCase,
      app: { t, algorithm },
    } = this.props;

    const questions = HealthCaresModel.getHealthCaresQuestions(algorithm, medicalCase);
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
