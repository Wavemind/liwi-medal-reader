// @flow
import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class Medecines extends Component<Props, State> {
  state = {};

  static defaultProps = {};

  render() {
    return (
      <View>
        <Text>Medecines</Text>
      </View>
    );
  }
}
