// @flow

import * as React from 'react';
import { Picker, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { styles } from './List.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class List extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;

    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value
    );
  }

  onValueChange = (value: string) => {
    const { question, setAnswer } = this.props;
    setAnswer(question.id, value);
  };

  render() {
    const { question } = this.props;

    const PickerItem = [];

    Object.keys(question.answers).map((id) =>
      question.answers[id].value !== 'not_available'
        ? PickerItem.push(
            <Picker.Item
              key={id + '_picker'}
              label={question.answers[id].label}
              value={id}
            />
          )
        : null
    );
    return (
      <View answer>
        <Picker
          mode="dropdown"
          iosHeader="Select "
          style={styles.picker}
          selectedValue={question.answer}
          onValueChange={this.onValueChange}
        >
          <Picker.Item label="Select" value={null} />
          {PickerItem}
        </Picker>
      </View>
    );
  }
}
