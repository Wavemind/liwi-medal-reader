// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, H2, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import moment from 'moment';
import { getItem, getItems, setItem } from '../../../engine/api/LocalStorage';
import AnimatedPullToRefresh from '../../../components/AnimatedPullToRefresh/AnimatedPullToRefresh';
import {
  fetchAlgorithms,
  post,
} from '../../../../frontend_service/api/Http';
import { styles } from './Algorithms.style';
import { CardView, RightView } from '../../../template/layout';

type Props = NavigationScreenProps & {};
type State = { algorithms: Array<Object> };

export default class Algorithms extends React.Component<Props, State> {
  state = {
    algorithms: [],
    isRefreshing: false,
    patients: [],
    synchronisation: null,
  };

  async componentWillMount() {
    let patients = await getItems('patients');
    let synchronisation = await getItem('synchronisation');
    this.setState({ patients, synchronisation });
    await this.updateAlgorithms();
  }

  // Set algorithms in state from local storage
  updateAlgorithms = async () => {
    let algorithms = await getItems('algorithms');
    await this.setState({ algorithms });
  };

  contentView = () => {
    const { algorithms } = this.state;
    const { navigation } = this.props;

    return (
      <ScrollView>
        {algorithms.map((algorithm) => (
          <CardView
            elevation={5}
            key={algorithm.id + '_algorithm'}
            style={algorithm.selected ? styles.selected : styles.view}
          >
            <H2>{algorithm.name}</H2>
            <Text>versions : {algorithm.versions}</Text>
            <RightView>
              <Button
                disabled
                key={algorithm.versions}
                onPress={() => {
                  navigation.navigate('Algorithm', {
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
        {algorithms.length === 0 ? (
          <CardView elevation={5} key="_algo" style={styles.view}>
            <Text>Aucun algorithme</Text>
          </CardView>
        ) : null}
      </ScrollView>
    );
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

  sendSync = async () => {
    const { patients } = this.state;
    const {
      app: {
        user: {
          data: { id },
        },
      },
    } = this.props;
    const body = { patients: patients };
    let resultPosting = await post('medicases', body, id);
    const synchronisation = {
      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
      success: resultPosting,
    };
    await setItem('synchronisation', synchronisation);
    this.setState({ synchronisation });
  };

  render() {
    const { isRefreshing, synchronisation } = this.state;
    const {
      app: { t },
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.smallContent}>
            <Text>
              {synchronisation === null
                ? t('algorithms:never')
                : `${t('algorithms:last')} : ${synchronisation?.time} ${t(
                    'algorithms:success'
                  )} : ${synchronisation?.success}`}
            </Text>
            <Button onPress={this.sendSync}>
              <Text>{t('algorithms:synchronize')}</Text>
            </Button>
          </View>
          <AnimatedPullToRefresh
            isRefreshing={isRefreshing}
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
