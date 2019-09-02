// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import QuestionList from '../../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class Others extends React.Component<Props, State> {
  state: {
    questions: []
  };

  // Fetch first look assessment questions and order it
  componentWillMount() {
    const { medicalCase } = this.props;
    let questions = [];
    const orders = medicalCase.triage_orders[categories.other];

    orders.map((order) => {
      questions.push(medicalCase.nodes[order]);
    });

    this.setState({questions});
  }

  render() {
    const { questions } = this.state;

    return (
      <QuestionList questions={questions} />
    );
  }
}
