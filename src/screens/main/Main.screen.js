// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';

import HomeScreen from '../home';

export default class MainScreen extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <HomeScreen navigation={navigation} />
      </ScrollView>
    );
  }
}
