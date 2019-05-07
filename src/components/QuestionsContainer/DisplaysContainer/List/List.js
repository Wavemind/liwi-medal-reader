// @flow

import * as React from 'react';
import { Input, Item, Picker, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { styles } from './List.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class List extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    return (
      nextProps.question.answer !== this.props.question.answer ||
      nextProps.question.value !== this.props.question.value
    );
  }

  onValueChange = (value: string) => {
    this.props.setQuestion(this.props.question.id, value);
  };

  render() {
    const { question } = this.props;
    // TODO make it nice
    return (
      <View style={styles.view}>
        <Item>
          <Picker
            mode="dropdown"
            iosHeader="Select "
            style={styles.picker}
            selectedValue={question.answer}
            onValueChange={this.onValueChange}
          >
            <Picker.Item label="Choose the answer" value={null} />
            {Object.keys(question.answers).map((id) => (
              <Picker.Item
                label={question.answers[id].label}
                value={question.answers[id].id}
              />
            ))}
          </Picker>
        </Item>
      </View>
    );
  }
}
