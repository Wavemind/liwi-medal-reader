// @flow

import * as React from 'react';
import {
  Input,
  Item,
  View,
} from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import { styles } from './Numeric.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  shouldComponentUpdate(
    nextProps: Readonly<P>,
  ): boolean {
    return (
      nextProps.question.answer !== this.props.question.answer ||
      nextProps.question.value !== this.props.question.value
    );
  }

  _focus = () =>
    this.setState({
      style: { borderColor: liwiColors.greenColor },
    });

  _onEndEditing = (value) => {
    this.props.setQuestion(this.props.question.id, value.nativeEvent.text);
  };

  render() {
    const { question } = this.props;
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
      <View style={styles.view}>
        <Item>
          <Input
            keyboardType={keyboardType}
            question
            defaultValue={String(this.props.question.value)}
            onFocus={this._focus}
            onEndEditing={this._onEndEditing}
          />
        </Item>
      </View>
    );
  }
}
