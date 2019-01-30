// @flow

import * as React from 'react';
import { H2, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { get } from 'engine/api/Http';
import { QuestionView } from '../../../template/layout';
import QuestionFactory from '../QuestionFactory';

type Props = NavigationScreenProps & {};

type State = {};

export default class Questions extends React.Component<Props, State> {
  state = {};

  async componentWillMount() {}
  render() {
    const {} = this.state;
    const { questions } = this.props;

    return (
      <ScrollView>
        {Object.keys(questions).map((i) => (
          <QuestionFactory question={questions[i]} />
        ))}
      </ScrollView>
    );
  }
}
