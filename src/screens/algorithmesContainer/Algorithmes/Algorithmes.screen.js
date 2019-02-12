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
          <CardView elevation={5} key={algo.id + '_algo'}>
            <H2>{algo.name}</H2>
            <Text>{algo.description}</Text>
            <Text>N'versions : {algo.versions.length}</Text>
            <RightView>
              {algo.versions.map((algoVersion) => (
                <Button
                  key={algoVersion}
                  onPress={() =>
                    navigation.navigate('Algorithme', {
                      algoId: algoVersion.algorithm_id,
                      algoVersion: algoVersion.version,
                      title: algoVersion.name,
                    })
                  }
                >
                  <Text>V : {algoVersion.version}</Text>
                </Button>
              ))}
            </RightView>
          </CardView>
        ))}
      </View>
    );
  }
}
