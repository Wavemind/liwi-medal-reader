// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import QuestionFactory from '../QuestionFactory';

type Props = NavigationScreenProps & {};

type State = {};

export default class Questions extends React.PureComponent<Props, State> {
  state = {};

  async componentWillMount() {
  }

  render() {
    const { questions } = this.props;

    return (
      <ScrollView>
        {Object.keys(questions).map((i) => (
          <QuestionFactory question={questions[i]} key={i + '_factory'}/>
        ))}
      </ScrollView>
    );
  }
}
