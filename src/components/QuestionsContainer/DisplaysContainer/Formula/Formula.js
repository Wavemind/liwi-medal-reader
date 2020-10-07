// @flow

import * as React from 'react';
import { Input, View } from 'native-base';
import { styles } from './Formula.style';

export default class Formula extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value;
  }

  render() {
    const { question } = this.props;
    return (
      <View answer>
        <Input question defaultValue={question.value !== null ? String(question.value) : 'not defined'} disabled style={styles.input} />
      </View>
    );
  }
}
