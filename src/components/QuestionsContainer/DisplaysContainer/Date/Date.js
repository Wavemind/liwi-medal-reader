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
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value
    );
  }

  _onEndEditing = (value) => {
    const { setAnswer, question } = this.props;

    if (value !== question.value && value !== '') {
      setAnswer(question.id, value);
    } else if (question.value !== null && value === '') {
      setAnswer(question.id, null);
    }
  };

  render() {
    const { question } = this.props;
    const value = question.value === null ? 0 : question.value;

    return (
      <View answer>
        <DatePicker
          defaultDate={moment(value).toDate()}
          locale="fr"
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType="fade"
          androidMode="default"
          textStyle={styles.textColor}
          placeHolderTextStyle={styles.placeholder}
          onDateChange={this._onEndEditing}
          disabled={false}
        />
      </View>
    );
  }
}
