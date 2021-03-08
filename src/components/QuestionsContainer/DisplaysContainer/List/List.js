// @flow

import * as React from 'react';
import { Picker, View } from 'native-base';
import { styles } from './List.style';

export default class List extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value;
  }

  /**
   * Set value in store
   * @param {String} value
   */
  onValueChange = (value) => {
    const {
      app: { algorithm, set },
      setAnswer,
      setPatientValue,
      question,
      patientValueEdit,
    } = this.props;

    set('answeredQuestionId', question.id);

    if (patientValueEdit) {
      setPatientValue(question.id, value);
    } else {
      setAnswer(algorithm, question.id, value);
    }
  };

  render() {
    const {
      app: { algorithm, algorithmLanguage },
      question,
      isReadOnly,
    } = this.props;

    const PickerItem = [];
    const { answers } = algorithm.nodes[question.id];
    const unavailableAndOneAnswer = question.unavailableValue && Object.keys(answers).length === 1;
    Object.keys(answers).forEach((id) => (answers[id].value !== 'not_available' ? PickerItem.push(<Picker.Item key={`${id}_picker`} label={answers[id].label[algorithmLanguage]} value={String(id)} />) : null));

    if (unavailableAndOneAnswer) {
      this.onValueChange(String(Object.keys(answers)[0]));
    }
    return (
      <View answer>
        {unavailableAndOneAnswer ? (
          <Picker mode="dropdown" style={styles.picker} selectedValue={String(Object.keys(answers)[0])} enable={false}>
            {PickerItem}
          </Picker>
        ) : (
          <Picker mode="dropdown" style={styles.picker} selectedValue={String(question.answer)} onValueChange={this.onValueChange} enable={isReadOnly}>
            <Picker.Item label="Select" value={null} />
            {PickerItem}
          </Picker>
        )}
      </View>
    );
  }
}
