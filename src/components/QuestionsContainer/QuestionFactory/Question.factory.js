// @flow

import * as React from 'react';
import { View } from 'native-base';
import { styles } from './Question.style';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';
import Boolean from '../Question/Boolean';
import Numeric from '../Question/Numeric';

type Props = NavigationScreenProps & {};

type State = {};

export default class Question extends React.Component<Props, State> {
  state = {};

  render() {
    const { question } = this.props;
    let specificStyle;

    // TODO Change it to int LOOL
    switch (question.priority) {
      case 'triage':
        specificStyle = styles.triage;
        break;
      case 'priority':
        specificStyle = styles.priority;
        break;
      case 'normal':
        specificStyle = styles.normal;
        break;
      default:
        specificStyle = {};
        break;
    }

    switch (question.question_type) {
      case 'boolean':
        return <Boolean question={question} styles={specificStyle} />;
      case 'numeric':
        return <Numeric question={question} styles={specificStyle} />;
      default:
        return null;
    }
  }
}
