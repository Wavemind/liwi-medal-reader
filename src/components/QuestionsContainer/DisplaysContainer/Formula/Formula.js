// @flow

import * as React from 'react';
import { Text, View } from 'native-base';

type Props = {
  question: {
    answer: String,
    value: String,
    answers: Array,
  },
};

export default class Formula extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value
    );
  }

  render() {
    const { question } = this.props;

    return (
      <View answer>
        <Text>
          {question.answer === null
            ? 'empty'
            : question.answers[question.answer].label +
              ' : ( ' +
              question.value +
              ')'}
        </Text>
      </View>
    );
  }
}
