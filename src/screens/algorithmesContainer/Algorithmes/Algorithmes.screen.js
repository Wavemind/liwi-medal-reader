// @flow

import * as React from 'react';
import { Button, H2, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { get } from 'engine/api/Http';
import { getItems } from '../../../engine/api/LocalStorage';
import { CardView, RightView } from '../../../template/layout';
import AnimatedPullToRefresh from '../../../components/AnimatedpullToRefresh/AnimatedPullToRefresh';
import { fetchAlgorithmes } from '../../../engine/api/Http';
import { styles } from './Algorithmes.style.js';

type Props = NavigationScreenProps & {};

type State = { algorithmes: Array<Object> };
export default class Algorithmes extends React.Component<Props, State> {
  state = { algorithmes: [], isRefreshing: false };

  updateAlgorithmes = async () => {
    let algorithmes = await getItems('algorithmes');

    await this.setState({ algorithmes });
  };

  async componentWillMount() {
    await this.updateAlgorithmes();
  }

  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    const {
      app: { user },
    } = this.props;
    await fetchAlgorithmes(user.data.id);
    await this.updateAlgorithmes();
    this.setState({ isRefreshing: false });
  };

  render() {
    const { algorithmes } = this.state;
    const { navigation } = this.props;

    return (
      <View style={{ flex: 2 }}>
        <View style={{ flex: 7, backgroundColor: '#F8F4FC' }}>
          <AnimatedPullToRefresh
            isRefreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            pullHeight={100}
            contentView={
              <ScrollView>
                {algorithmes.map((algo) => (
                  <CardView
                    elevation={5}
                    key={algo.id + '_algo'}
                    style={styles.view}
                  >
                    <H2>{algo.name}</H2>
                    <Text>{algo.description}</Text>
                    <Text>N'versions : {algo.versions.length}</Text>
                    <RightView>
                      {algo.versions.map((algoVersion) => (
                        <Button
                          key={algoVersion}
                          onPress={() => {
                            navigation.navigate('Algorithme', {
                              algoId: algoVersion.algorithm_id,
                              algoVersion: algoVersion.version,
                              title: algoVersion.name,
                            });
                          }}
                        >
                          <Text>V : {algoVersion.version}</Text>
                        </Button>
                      ))}
                    </RightView>
                  </CardView>
                ))}
                {algorithmes.length === 0 ? (
                  <CardView elevation={5} key={'_algo'} style={styles.view}>
                    <Text>Aucun algorithme</Text>
                  </CardView>
                ) : null}
              </ScrollView>
            }
            onPullAnimationSrc={require('./medical.json')}
            onStartRefreshAnimationSrc={require('./medical.json')}
            onRefreshAnimationSrc={require('./medical.json')}
            onEndRefreshAnimationSrc={require('./medical.json')}
          />
        </View>
      </View>
    );
  }
}
