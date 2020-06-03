// @flow

import * as React from 'react';
import { Input, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class String extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value;
  }

  state = {
    style: null,
  };

  _focus = () =>
    this.setState({
      style: { borderColor: liwiColors.greenColor },
    });

  _onEndEditing = (value) => {
    const { setAnswer, setPatientValue, question, patientValueEdit } = this.props;
    if (patientValueEdit) {
      if (value.nativeEvent.text !== question.value && value.nativeEvent.text !== '') {
        setPatientValue(question.id, value.nativeEvent.text);
      } else if (question.value !== null && value.nativeEvent.text === '') {
        setPatientValue(question.id, null);
      }
    } else {
      if (value.nativeEvent.text !== question.value && value.nativeEvent.text !== '') {
        setAnswer(question.id, value.nativeEvent.text);
      } else if (question.value !== null && value.nativeEvent.text === '') {
        setAnswer(question.id, null);
      }
    }
  };

  render() {
    const { question } = this.props;
    const { style } = this.state;

    return (
      <View answer>
        <Input question defaultValue={question.value} style={style} onFocus={this._focus}
               onEndEditing={this._onEndEditing} />
      </View>
    );
  }
}
