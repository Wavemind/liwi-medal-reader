// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../frontend_service/constants';
import QuestionList from '../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};
type State = {};

// eslint-disable-next-line react/prefer-stateless-function
// Because a function component is causing error from wrappers
export default class Tests extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: 'Tests : ' + patient.lastname + ' ' + patient.lastname,
    });
  }

  render() {
    const { medicalCase } = this.props;

    let assessmentTest = medicalCase.nodes.filterBy([
      { by: 'category', operator: 'equal', value: categories.assessment },
      { by: 'counter', operator: 'more', value: 0 },
    ]);

    return (
      <React.Fragment>
        <QuestionList questions={assessmentTest} />
      </React.Fragment>
    );
  }
}
