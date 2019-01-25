// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class Algorithme extends React.Component<Props, State> {
  state = {};

  componentWillMount() {}

  render() {
    const {} = this.props;

    return (
      <View>
        <Text>Algorithme</Text>
      </View>
    );
  }
}
