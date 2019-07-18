// @flow

import * as React from 'react';
import { Item, Picker, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { styles } from './List.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class List extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const {question} = this.props;
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value
    );
  }

  onValueChange = (value: string) => {
    const {question, setQuestion} = this.props;
    setQuestion(question.id, value);
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
                key={question.answers[id].id + '_picker'}
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
