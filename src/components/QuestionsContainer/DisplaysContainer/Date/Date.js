// @flow

import * as React from 'react';
import { DatePicker, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { liwiColors } from '../../../../utils/constants';

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
    if (value.nativeEvent.text !== question.value) {
      setAnswer(question.id,  moment(value.nativeEvent.text).format('DD/MM/YYYY'));
    }
  };

  render() {
    const { question } = this.props;

    return (
      <View answer>
        <DatePicker
          defaultDate={moment(question.value).toDate()}
          minimumDate={new Date(1930, 1, 1)}
          maximumDate={new Date()}
          locale="fr"
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType="fade"
          androidMode="default"
          textStyle={{ color: liwiColors.blackColor, padding: 20 }}
          placeHolderTextStyle={{ color: liwiColors.darkerGreyColor }}
          onDateChange={this._onEndEditing}
          disabled={false}
        />
      </View>
    );
  }
}
