// @flow

import * as React from 'react';
import { Text, View, Button } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { algo } from '../../../engine/algorithme/algo_v3';
type Props = NavigationScreenProps & {};

type State = {};

export default class RootAlgorithmes extends React.Component<Props, State> {
  state = { algorithmes: [] };

  componentWillMount() {
    let algorithmes = [];
    algorithmes.push(algo);
    this.setState({ algorithmes });
  }

  render() {
    const { algorithmes } = this.state;

    return (
      <View>
        <Text>Algorithmes</Text>
        {algorithmes.map((algo) => (
          <Button>
            <Text>{algo.version}</Text>
            <Text>{algo.name}</Text>
          </Button>
        ))}
      </View>
    );
  }
}
