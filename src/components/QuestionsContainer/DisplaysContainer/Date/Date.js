// @flow

import * as React from 'react';
import { DatePicker, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { styles } from './Date.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Date extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value;
  }

  /**
   * Set date in store
   * @param {Date} value
   * @private
   */
  _onEndEditing = (value) => {
    const { setAnswer, setPatientValue, question, patientValueEdit } = this.props;

    if (patientValueEdit) {
      if (value !== question.value && value !== '') {
        setPatientValue(question.id, moment(value).format());
      } else if (question.value !== null && value === '') {
        setPatientValue(question.id, null);
      }
    } else {
      if (value !== question.value && value !== '') {
        setAnswer(question.id, moment(value).format());
      } else if (question.value !== null && value === '') {
        setAnswer(question.id, null);
      }
    }
  };

  render() {
    const { question, isReadOnly } = this.props;

    const value = question.value === null ? null : moment(question.value).toDate();

    return (
      <View answer>
        <DatePicker
          defaultDate={value}
          locale="fr"
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType="fade"
          androidMode="default"
          textStyle={styles.textColor}
          placeHolderTextStyle={styles.placeholder}
          onDateChange={this._onEndEditing}
          disabled={isReadOnly}
        />
      </View>
    );
  }
}
