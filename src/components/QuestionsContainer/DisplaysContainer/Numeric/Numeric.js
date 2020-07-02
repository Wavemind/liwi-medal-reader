// @flow

import * as React from 'react';
import { Input, Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import { LeftButton, RightButton } from '../../../../template/layout';
import styles from './Numeric.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  state = {
    value: null,
    style: {
      borderBottomColor: liwiColors.blackLightColor,
      borderBottomWidth: 1,
    },
  };

  shouldComponentUpdate(nextProps: Readonly<P>, nextState): boolean {
    const { value, estimableValue } = this.state;
    const { question } = this.props;

    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value || nextState.value !== value || nextState.estimableValue !== estimableValue;
  }

  componentDidMount() {
    const { question } = this.props;

    this.setState({
      value: question.value,
      estimableValue: question.estimableValue,
    });
  }

  /**
   * Save value in store
   * @param {Event} e
   */
  onEndEditing = (e) => {
    const value = e.nativeEvent.text;
    const { setAnswer, setPatientValue, question, patientValueEdit } = this.props;

    if (patientValueEdit) {
      if (value !== question.value && value !== '') {
        setPatientValue(question.id, value);
      } else if (question.value !== null && value === '') {
        setPatientValue(question.id, null);
      }
    } else if (value !== question.value && value !== '') {
      setAnswer(question.id, value);
    } else if (question.value !== null && value === '') {
      setAnswer(question.id, null);
    }
  };

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
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

  _handleEstimable = (value) => {
    const { setEstimable, question } = this.props;
    setEstimable(question.id, value);
    this.setState({estimableValue: value});
  };

  render() {
    const {
      question,
      unavailableAnswer,
      isReadOnly,
      app: { t },
    } = this.props;
    let { style, value, estimableValue } = this.state;

    const keyboardType = 'number-pad';
    let placeholder = '';

    if (unavailableAnswer !== undefined && question.answer === unavailableAnswer.id) {
      placeholder = t('question:unavailable');
    }

    value = value !== null ? String(value) : null;
    return (
      <>
        <View answer>
          <Input keyboardType={keyboardType} question numeric value={value} onChange={this.onChange} style={style} onEndEditing={this.onEndEditing} placeholder={placeholder} disabled={isReadOnly} />
        </View>
        {question.estimable ? (
          <View answer style={styles.marginTop}>
            <LeftButton active={estimableValue === 'measured'} onPress={() => this._handleEstimable('measured')} disabled={isReadOnly}>
              <Text center white={estimableValue === 'measured'} style={styles.estimableFontSize}>
                {t('question:measured')}
              </Text>
            </LeftButton>

            <RightButton active={estimableValue === 'estimated'} onPress={() => this._handleEstimable('estimated')} disabled={isReadOnly}>
              <Text center white={estimableValue === 'estimated'} style={styles.estimableFontSize}>
                {t('question:estimated')}
              </Text>
            </RightButton>
          </View>
        ) : null}
      </>
    );
  }
}
