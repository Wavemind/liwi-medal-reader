// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { getItems } from '../../../engine/api/LocalStorage';
import AnimatedPullToRefresh from '../../../components/AnimatedPullToRefresh/AnimatedPullToRefresh';
import { fetchAlgorithms } from '../../../../frontend_service/engine/api/Http';
import { styles } from './Algorithms.style.js';
import {
  CardView,
  RightView,
} from '../../../template/layout';
import {
  Button,
  H2,
  Text,
  View,
} from 'native-base';
import {ScrollView} from 'react-native';

type Props = NavigationScreenProps & {};
type State = { algorithms: Array<Object> };

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
    const { algorithms } = this.state;
    const { navigation } = this.props;

    console.log(algorithms)

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <AnimatedPullToRefresh
            isRefreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            pullHeight={100}
            contentView={
              <ScrollView>
                {algorithms.map((algorithm) => (
                  <CardView
                    elevation={5}
                    key={algorithm.id + '_algorithm'}
                    style={styles.view}
                  >
                    <H2>{algorithm.name}</H2>
                    <Text>{algorithm.description}</Text>
                  </CardView>
                ))}
                {algorithms.length === 0 ? (
                  <CardView elevation={5} key={'_algo'} style={styles.view}>
                    <Text>Aucun algorithme</Text>
                  </CardView>
                ) : null}
              </ScrollView>
            }
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
