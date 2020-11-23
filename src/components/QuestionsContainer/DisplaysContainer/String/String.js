// @flow

import * as React from 'react';
import { Input, View } from 'native-base';
import { liwiColors } from '../../../../utils/constants';

export default class String extends React.Component {
  state = {
    style: null,
  };

  shouldComponentUpdate(nextProps) {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value;
  }

  /**
   * Change color of input on focus
   */
  focus = () =>
    this.setState({
      style: { borderColor: liwiColors.greenColor },
    });

  /**
   * Save value in store
   * @param {String} value
   */
  onEndEditing = (value) => {
    const {
      app: { algorithm, set },
      setAnswer,
      setPatientValue,
      question,
      patientValueEdit,
    } = this.props;

    if (patientValueEdit) {
      if (value.nativeEvent.text !== question.value && value.nativeEvent.text !== '') {
        setPatientValue(question.id, value.nativeEvent.text);
      } else if (question.value !== null && value.nativeEvent.text === '') {
        setPatientValue(question.id, null);
      }
    } else if (value.nativeEvent.text !== question.value && value.nativeEvent.text !== '') {
      setAnswer(algorithm, question.id, value.nativeEvent.text);
    } else if (question.value !== null && value.nativeEvent.text === '') {
      setAnswer(algorithm, question.id, null);
    }

    set('answeredQuestionId', question.id);
  };

  render() {
    const { question, isReadOnly } = this.props;
    const { style } = this.state;

    return (
      <View answer>
        <Input question defaultValue={question.value} style={style} onFocus={this.focus} onEndEditing={this.onEndEditing} disabled={isReadOnly} />
      </View>
    );
  }
}
