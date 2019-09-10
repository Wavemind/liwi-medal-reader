// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import { categories } from '../../../../../frontend_service/constants';
import QuestionList from '../../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class FirstLookAssessments extends React.Component<
  Props,
  State
> {
  render() {
    const { medicalCase } = this.props;
    let questions = [];
    const orders = medicalCase.triage.orders[categories.firstLookAssessment];

    orders.map((order) => {
      questions.push(medicalCase.nodes[order]);
    });

    return <QuestionList questions={questions} />;
  }
}
