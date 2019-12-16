// @flow

import * as React from 'react';
import { Input, View } from 'native-base';
import { liwiColors } from '../../../../utils/constants';

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
        <Input
          question
          defaultValue={question.value !== null ? String(question.value) : 'not defined'}
          disabled
          style={{backgroundColor: liwiColors.greyColor, textAlign:'center'}}
        />
      </View>
    );
  }
}
