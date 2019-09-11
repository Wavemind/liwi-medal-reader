// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import QuestionList from '../../../../components/Triage/QuestionList';
import NavigationTriage from '../../../../components/Triage/NavigationTriage';
import { categories } from '../../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class ChronicalConditions extends React.Component<Props, State> {
  render() {
    const { medicalCase } = this.props;
    let questions = [];
    const orderedQuestions = medicalCase.triage.orders[categories.chronicalCondition];

    orderedQuestions.map((orderedQuestion) => {
      let question = medicalCase.nodes[orderedQuestion];
      if (question.isDisplayedInTriage(medicalCase)) {
        questions.push(question);
      }
    });

    return (
      <React.Fragment>
        <QuestionList questions={orderedQuestions} />
        <NavigationTriage questionsInScreen={orderedQuestions} />
      </React.Fragment>
    );
  }
}
