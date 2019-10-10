// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../frontend_service/constants';
import QuestionList from '../../../components/Triage/QuestionList';
import NavigationTriage from '../../../components/Triage/NavigationTriage';

type Props = NavigationScreenProps & {};

export default class Tests extends React.Component<Props> {
  render() {
    const { medicalCase } = this.props;

    let assessmentTest = medicalCase.nodes.filterBy( [
      { by: 'category', operator: 'equal', value: categories.assessment },
      { by: 'counter', operator: 'more', value: 0 },
    ] );

    return (
      <React.Fragment>
        <QuestionList questions={assessmentTest} />
      </React.Fragment>
    );
  }
}
