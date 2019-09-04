// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import QuestionList from '../../../../components/Triage/QuestionList';
import NavigationTriage from '../../../../components/Triage/NavigationTriage';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class Assessments extends React.Component<Props, State> {
  render() {
    const { medicalCase } = this.props;
    const questions = medicalCase.nodes.filterByCategory(categories.assessment);

    return (
      <React.Fragment>
        <QuestionList questions={questions} />
        <NavigationTriage questionsInScreen={questions} />
      </React.Fragment>
    );
  }
}
