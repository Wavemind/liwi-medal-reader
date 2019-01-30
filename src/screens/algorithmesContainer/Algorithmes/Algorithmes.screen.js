// @flow

import * as React from 'react';
import { Button, H2, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { get } from 'engine/api/Http';
import { getItems } from '../../../engine/api/LocalStorage';
import { CardView, RightView } from '../../../template/layout';

type Props = NavigationScreenProps & {};

type State = { algorithmes: Array<Object> };
export default class Algorithmes extends React.Component<Props, State> {
  state = { algorithmes: [] };

  async componentWillMount() {
    let algorithmes = await getItems('algorithmes');
    this.setState({ algorithmes });
  }
  render() {
    const { algorithmes } = this.state;
    const { navigation } = this.props;

    return (
      <View>
        {algorithmes.map((algo) => (
          <CardView elevation={5}>
            <H2>{algo.algorithm.name}</H2>
            <Text>{algo.algorithm.description}</Text>
            <Text>{algo.version}</Text>
            <RightView>
              <Button
                onPress={() =>
                  navigation.navigate('Algorithme', {
                    algoId: algo.algorithm_id,
                    title: algo.algorithm.name,
                  })
                }
              >
                <Text>Voir le détail</Text>
              </Button>
            </RightView>
          </CardView>
        ))}
      </View>
    );
  }
}
