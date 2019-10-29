// @flow

import * as React from 'react';
import { Input, View } from 'native-base';
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
    style: {
      borderBottomColor: liwiColors.blackLightColor,
      borderBottomWidth: 1,
    },
  };

  _onEndEditing = (value) => {
    const { setAnswer, question } = this.props;

    if (
      value.nativeEvent.text !== question.value &&
      value.nativeEvent.text !== ''
    ) {
      setAnswer(question.id, value.nativeEvent.text);
    } else if (question.value !== null && value.nativeEvent.text === '') {
      setAnswer(question.id, null);
    }
  };

  render() {
    const {
      question,
      unavailableAnswer,
      app: { t },
    } = this.props;
    const { style } = this.state;

    let keyboardType;
    let placeholder = '';
    switch (question.value_format) {
      case 'Integer':
        keyboardType = 'number-pad';
        break;

      case 'Float':
        keyboardType = 'number-pad';
        break;
    }

    if (
      unavailableAnswer !== undefined &&
      question.answer === unavailableAnswer.id
    ) {
      placeholder = t('question:unavailable');
    }

    return (
      <View answer>
        <Input
          keyboardType={keyboardType}
          question
          numeric
          defaultValue={question.value !== null ? String(question.value) : null}
          style={style}
          onEndEditing={this._onEndEditing}
          placeholder={placeholder}
        />
      </View>
    );
  }
}
