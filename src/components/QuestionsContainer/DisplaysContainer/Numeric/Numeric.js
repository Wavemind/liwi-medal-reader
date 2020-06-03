// @flow

import * as React from "react";
import { Input, View } from "native-base";
import type { NavigationScreenProps } from "react-navigation";
import { liwiColors } from "../../../../utils/constants";

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>, nextState): boolean {
    const { question } = this.props;

    const { value } = this.state;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value || nextState.value !== value;
  }

  componentDidMount() {
    const { question } = this.props;
    this.setState({ value: question.value });
  }

  state = {
    value: null,
    style: {
      borderBottomColor: liwiColors.blackLightColor,
      borderBottomWidth: 1,
    },
  };

  _onEndEditing = (e) => {
    const value = e.nativeEvent.text;
    const { setAnswer, setPatientValue, question, patientValueEdit } = this.props;

    if (patientValueEdit) {
      if (value !== question.value && value !== '') {
        setPatientValue(question.id, value);
      } else if (question.value !== null && value === '') {
        setPatientValue(question.id, null);
      }
    } else {
      if (value !== question.value && value !== '') {
        setAnswer(question.id, value);
      } else if (question.value !== null && value === '') {
        setAnswer(question.id, null);
      }
    }
  };

  onChange = (e) => {
    let value = e.nativeEvent.text;

    const regWithComma = /^[0-9,]+$/;

    // Replace comma with dot
    if (regWithComma.test(value)) {
      value = value.replace(',', '.');
    }

    // Remove char that are not number or dot
    value = value.replace(/[^0-9.]/g, '');

    // Parse to float if value is not empty and last char is not dot
    if (value !== '' && value.charAt(value.length - 1) !== '.') {
      value = parseFloat(value);
    }

    this.setState({ value });
  };

  render() {
    const {
      question,
      unavailableAnswer,
      app: { t },
    } = this.props;
    let { style, value } = this.state;

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

    if (unavailableAnswer !== undefined && question.answer === unavailableAnswer.id) {
      placeholder = t('question:unavailable');
    }

    value = value !== null ? String(value) : null;

    return (
      <View answer>
        <Input keyboardType={keyboardType} question numeric value={value} onChange={this.onChange} style={style} onEndEditing={this._onEndEditing} placeholder={placeholder} l/>
      </View>
    );
  }
}
