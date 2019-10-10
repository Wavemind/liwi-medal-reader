// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import { categories } from '../../../../../frontend_service/constants';
import QuestionList from '../../../../components/Triage/QuestionList';
import NavigationTriage from '../../../../components/Triage/NavigationTriage';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class VitalSigns extends React.Component<Props, State> {
  render() {
    const { medicalCase } = this.props;
    let questions = [];

    const orderedQuestions = medicalCase.triage.orders[categories.vitalSign];

    orderedQuestions.map((orderedQuestion) => {
      let question = medicalCase.nodes[orderedQuestion];
      if (question.isDisplayedInTriage(medicalCase)) {
        questions.push(question);
      }
    });

    return (
      <React.Fragment>
        <QuestionList questions={questions} />
        <NavigationTriage />
      </React.Fragment>
    );
  }
}
