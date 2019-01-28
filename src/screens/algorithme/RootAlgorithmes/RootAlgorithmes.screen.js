// @flow

import * as React from 'react';
import { Text, View, Button, H2 } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { algo } from '../../../engine/algorithme/algo_v3';
import { get } from 'engine/api/Http';
import { getItems } from '../../../engine/api/LocalStorage';
import { CardView, RightView } from '../../../template/layout';
type Props = NavigationScreenProps & {};

type State = {};
export default class RootAlgorithmes extends React.Component<Props, State> {
  state = { algorithmes: [] };

  async componentWillMount() {
    let algorithmes = await getItems('algorithmes');
    this.setState({ algorithmes });
  }
  render() {
    const { algorithmes } = this.state;

    return (
      <View>
        <Text>Algorithmes</Text>
        {algorithmes.map((algo) => (
          <CardView elevation={5}>
            <H2>{algo.algorithm.name}</H2>
            <Text>{algo.version}</Text>
            <RightView>
              <Button>
                <Text>Voir le détail</Text>
              </Button>
            </RightView>
          </CardView>
        ))}
      </View>
    );
  }
}
