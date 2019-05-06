// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { getItems } from '../../../engine/api/LocalStorage';
import AnimatedPullToRefresh from '../../../components/AnimatedPullToRefresh/AnimatedPullToRefresh';
import { fetchAlgorithms } from '../../../../frontend_service/engine/api/Http';
import { styles } from './Algorithms.style.js';
import { CardView, RightView } from '../../../template/layout';
import { Button, H2, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
type Props = NavigationScreenProps & {};
type State = { algorithms: Array<Object> };
import moment from 'moment';

export default class Algorithms extends React.Component<Props, State> {
  state = {
    algorithms: [],
    isRefreshing: false,
  };

  async componentWillMount() {
    await this.updateAlgorithms();
  }

  // Set algorithms in state from local storage
  updateAlgorithms = async () => {
    let algorithms = await getItems('algorithms');

    await this.setState({ algorithms });
  };

  contentView = () => (
    <ScrollView>
      {this.state.algorithms.map((algorithm) => (
        <CardView
          elevation={5}
          key={algorithm.id + '_algorithm'}
          style={algorithm.selected ? styles.selected : styles.view}
        >
          <H2>{algorithm.name}</H2>
          <Text>{algorithm.description} </Text>
          <Text>versions : {algorithm.versions}</Text>
          <RightView>
            <Button
              key={algorithm.versions}
              onPress={() => {
                this.props.navigation.navigate('Algorithm', {
                  algoId: algorithm.algorithm_id,
                  algoVersion: algorithm.version,
                  title: algorithm.name,
                });
              }}
            >
              <Text>V : {algorithm.version}</Text>
            </Button>
          </RightView>
        </CardView>
      ))}
      {this.state.algorithms.length === 0 ? (
        <CardView elevation={5} key={'_algo'} style={styles.view}>
          <Text>Aucun algorithme</Text>
        </CardView>
      ) : null}
    </ScrollView>
  );

  // Fetch algorithms from server and save it in local storage
  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    const {
      app: { user },
    } = this.props;
    await fetchAlgorithms(user.data.id);
    await this.updateAlgorithms();
    this.setState({ isRefreshing: false });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <AnimatedPullToRefresh
            isRefreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            pullHeight={100}
            contentView={this.contentView()}
            onPullAnimationSrc={require('../../../utils/animations/medical.json')}
            onStartRefreshAnimationSrc={require('../../../utils/animations/medical.json')}
            onRefreshAnimationSrc={require('../../../utils/animations/medical.json')}
            onEndRefreshAnimationSrc={require('../../../utils/animations/medical.json')}
          />
        </View>
      </View>
    );
  }
}
