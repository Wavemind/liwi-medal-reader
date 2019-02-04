// @flow

import * as React from 'react';
import { Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class LwRadio extends React.Component<Props, State> {
  state = { medicalCases: [] };

  componentWillMount() {}

  render() {
    const {} = this.props;

    return <View />;
  }
}
