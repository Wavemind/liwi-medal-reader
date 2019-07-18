// @flow

import * as React from 'react';
import { Input, Item, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value
    );
  }

  state = {
    style: null,
  };

  _focus = () =>
    this.setState({
      style: { borderColor: liwiColors.greenColor },
    });

  _onEndEditing = (value) => {
    const { setQuestion, question } = this.props;
    if (value.nativeEvent.text !== question.value) {
      setQuestion(question.id, value.nativeEvent.text);
    }
  };

  render() {
    const { question } = this.props;
    const { style } = this.state;

    let keyboardType;
    switch (question.value_format) {
      case 'Integer':
        keyboardType = 'number-pad';
        break;

      case 'Float':
        keyboardType = 'number-pad';
        break;
    }

    return (
      <View answer>
        <Item>
          <Input
            keyboardType={keyboardType}
            question
            defaultValue={String(question.value)}
            style={style}
            onFocus={this._focus}
            onEndEditing={this._onEndEditing}
          />
        </Item>
      </View>
    );
  }
}
