// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import QuestionList from '../../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class Comorbidities extends React.Component<Props, State> {

  render() {
    let questions = [];

    return (
      <QuestionList questions={questions} />
    );
  }
}
