// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../../frontend_service/constants';
import QuestionList from '../../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};

type State = {};

export default class VitalSigns extends React.Component<Props, State> {
  state: {
    questions: []
  };

  // Fetch first look assessment questions and order it
  componentWillMount() {
    const { medicalCase } = this.props;
    let questions = [];
    const orders = medicalCase.triage_orders[categories.vitalSign];

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
