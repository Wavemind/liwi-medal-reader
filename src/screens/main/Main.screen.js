// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import HomeScreen from '../home';

type Props = NavigationScreenProps & {};
type State = {};

export default class MainScreen extends React.Component<Props, State> {
  render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <HomeScreen navigation={navigation} />
      </ScrollView>
    );
  }
}
