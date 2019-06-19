// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {
  Body,
  Button,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Switch,
  Text,
} from 'native-base';
import { ScrollView } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class PhysicalExam extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { t } = this.props;

    return (
      <ScrollView>
        <Text>PhysicalExam</Text>
      </ScrollView>
    );
  }
}
