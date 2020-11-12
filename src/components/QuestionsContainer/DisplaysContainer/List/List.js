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
      app: { algorithm },
      setAnswer,
      setPatientValue,
      question,
      patientValueEdit,
    } = this.props;

    if (patientValueEdit) {
      setPatientValue(question.id, value);
    } else {
      setAnswer(algorithm, question.id, value);
    }
  };

  render() {
    const {
      app: { algorithm },
      question,
      isReadOnly,
    } = this.props;

    const PickerItem = [];
    const { answers } = algorithm.nodes[question.id];

    Object.keys(answers).map((id) => (answers[id].value !== 'not_available' ? PickerItem.push(<Picker.Item key={`${id}_picker`} label={answers[id].label} value={String(id)} />) : null));

    return (
      <View answer>
        <Picker mode="dropdown" style={styles.picker} selectedValue={String(question.answer)} onValueChange={this.onValueChange} enable={isReadOnly}>
          <Picker.Item label="Select" value={null} />
          {PickerItem}
        </Picker>
      </View>
    );
  }
}
