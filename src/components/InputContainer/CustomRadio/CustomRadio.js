// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class CustomRadio extends React.Component<Props, State> {
  state = { };

  componentWillMount() {}

  render() {
    return <View />;
  }
}
