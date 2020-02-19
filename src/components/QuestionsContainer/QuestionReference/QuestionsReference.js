// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import QuestionFactory from '../QuestionFactory';
import { stage } from '../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class QuestionsReference extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Props): boolean {
    const {
      question,
      medicalCase: { nodes },
    } = this.props;
    const {
      medicalCase: { nodes: nextNodes },
      question: nextQuestion,
    } = nextProps;

    // Prevent empty redux crash
    if (nextProps.medicalCase.id === undefined) {
      return false;
    }

    const nodeX = nodes[question.reference_table_x_id];
    const nextNodeX = nextNodes[question.reference_table_x_id];
    const nodeY = nodes[question.reference_table_y_id];
    const nextNodeY = nextNodes[question.reference_table_y_id];

    return Object.compare(nodeX, nextNodeX) || Object.compare(nodeY, nextNodeY) || Object.compare(question, nextQuestion);
  }

  render() {
    const {
      question,
      medicalCase: { nodes },
    } = this.props;

    const nodeX = nodes[question.reference_table_x_id];
    const nodeY = nodes[question.reference_table_y_id];

    return (
      <React.Fragment>
        <QuestionFactory {...this.props} question={question} key={`${question.id}_factory`} />
        {nodeX.stage !== stage.triage ? <QuestionFactory {...this.props} question={nodeX} key={`${nodeX.id}_factory` + '_ref'} /> : null}
        {nodeY.stage !== stage.triage ? <QuestionFactory {...this.props} question={nodeY} key={`${nodeY.id}_factory` + '_ref'} /> : null}
      </React.Fragment>
    );
  }
}
