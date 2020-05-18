// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './Filter.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class Filter extends React.Component<Props, State> {
  render() {
    return (
      <View padding-auto>
        <Text>Coucou</Text>
      </View>
    );
  }
}
