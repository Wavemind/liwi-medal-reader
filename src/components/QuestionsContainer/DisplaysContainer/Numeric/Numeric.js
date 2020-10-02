// @flow

import * as React from 'react';
import { Input, Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { LeftButton, RightButton } from '../../../../template/layout';
import { styles } from './Numeric.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  state = {
    value: null,
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
    const { app:{algorithm}, setAnswer, setPatientValue, question, patientValueEdit } = this.props;

    if (patientValueEdit) {
      if (value !== question.value && value !== '') {
        setPatientValue(question.id, value);
      } else if (question.value !== null && value === '') {
        setPatientValue(question.id, null);
      }
    } else if (value !== question.value && value !== '') {
      setAnswer(algorithm, question.id, value);
    } else if (question.value !== null && value === '') {
      setAnswer(algorithm, question.id, null);
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

  /**
   * Set if value is estimated or measured
   * @param {String} value - estimed | measured
   * @private
   */
  _handleEstimable = (value) => {
    const { setEstimable, question } = this.props;
    setEstimable(question.id, value);
    this.setState({ estimableValue: value });
  };

  render() {
    const {
      question,
      unavailableAnswer,
      isReadOnly,
      app: { t },
    } = this.props;
    let { value, estimableValue } = this.state;

    value = value !== null ? String(value) : null;
    let placeholder = '';

    if (unavailableAnswer !== undefined && question.answer === unavailableAnswer.id) {
      placeholder = t('question:unavailable');
    }

    return (
      <>
        <View answer>
          <Input keyboardType="number-pad" question numeric value={value} onChange={this.onChange} onEndEditing={this.onEndEditing} placeholder={placeholder} disabled={isReadOnly} />
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
