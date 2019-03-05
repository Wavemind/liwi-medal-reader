// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class CustomDropdown extends React.Component<Props, State> {
  state = { medicalCases: [] };

  componentWillMount() {}

  render() {
    const {} = this.props;

    return <View />;
  }
}
