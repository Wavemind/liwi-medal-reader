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
    const { setAnswer, question } = this.props;

    if (value.nativeEvent.text !== question.value && value.nativeEvent.text !== '' ) {
      setAnswer(question.id, value.nativeEvent.text);
    } else if (question.value !== null && value.nativeEvent.text === '') {
      setAnswer(question.id, null);
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
            numeric
            defaultValue={
              question.answer !== null ? String(question.value) : null
            }
            style={style}
            onFocus={this._focus}
            onEndEditing={this._onEndEditing}
          />
        </Item>
      </View>
    );
  }
}
