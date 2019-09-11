// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { CheckBox } from 'native-base';

type Props = NavigationScreenProps & {};

type State = {};

export default class CustomCheckbox extends React.Component<Props, State> {
  state = {};

  componentWillMount() {}

  onPress = () => {

    const { setAnswer, question, unavailable } = this.props;

    if (question.answer === null || question.answer !== unavailable.id) {
      setAnswer(question.id, unavailable.id);
    } else {
      setAnswer(question.id, null);
    }
  };
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;

    return question.answer !== nextProps.question.answer;
  }

  render() {
    const { question, unavailable } = this.props;
    return (
      <CheckBox
        onPress={this.onPress}
        checked={question.answer === unavailable.id}
      />
    );
  }
}
