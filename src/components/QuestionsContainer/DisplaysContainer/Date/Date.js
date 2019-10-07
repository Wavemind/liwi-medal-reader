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

    let date =  moment(value).format('DD/MM/YYYY');

    if (date !== question.value && value !== '' ) {
      setAnswer(question.id, date);
    } else if (question.value !== null && value.nativeEvent.text === '') {
      setAnswer(question.id, null);
    }
  };

  render() {
    const { question } = this.props;

    return (
      <View answer>
        <DatePicker
          defaultDate={moment(question.value).toDate()}
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
