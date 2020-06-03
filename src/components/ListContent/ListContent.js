// @flow

import * as React from 'react';
import { FlatList } from 'react-native';
import { Button, Picker, ListItem, Text, View, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { getItems } from '../../engine/api/LocalStorage';
import { styles } from './ListContent.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { medicalCaseStatus } from '../../../frontend_service/constants';
import { getDeviceInformation } from '../../engine/api/Device';

type Props = NavigationScreenProps & {};

type State = {};

export default class ListContent extends React.Component<Props, State> {
  state = {
    loading: false,
    columns: {},
    nodes: {},
    data: [],
    currentPage: 1,
    isLastBatch: false,
    firstLoading: true,
    status: null,
    filters: {},
  };

  async componentDidMount() {
    const { list, navigation } = this.props;

    const filters = navigation.getParam('filters');
    await this._fetchList();

    const isConnected = await getItems('isConnected');
    const deviceInfo = await getDeviceInformation();
    const algorithm = await getItems('algorithm');

    const columns = algorithm.mobile_config[list];
    const { nodes } = algorithm;

    this.setState({ columns, nodes, firstLoading: false, isConnected, deviceInfo });
  }

  async componentDidUpdate(nextProps, nextState) {
    // const filters = this.props.navigation.getParam('filters');
    // console.log('old', this.state.filters)
    // console.log('new', filters)
    // console.log('new nextProps', nextProps.filters)
    // console.log('new nextState', nextState.filters)
    // console.log("##################################################")
    if (nextProps.query !== this.props.query) {
      await this._fetchList();
    }
  }

  /**
   * Fetch data
   * @returns {Promise<void>}
   */
  _fetchList = async () => {
    const {
      app: { database },
      model,
      query,
    } = this.props;
    const { currentPage, filters } = this.state;

    this.setState({ loading: true });

    const options = { query, filters };
    const data = await database.getAll(model, 1, options);

    this.setState({
      data,
      currentPage: currentPage + 1,
      loading: false,
      isLastBatch: false,
    });
  };

  /**
   * Load more item to display
   * @private
   */
  _handleLoadMore = () => {
    const {
      app: { database },
      model,
      query,
    } = this.props;
    const { data, currentPage, filters } = this.state;

    this.setState(
      {
        loading: true,
      },
      async () => {
        const options = {
          query,
          filters,
        };
        const newData = await database.getAll(model, currentPage, options);
        const isLastBatch = newData.length === 0;

        this.setState({
          data: data.concat(newData),
          currentPage: currentPage + 1,
          isLastBatch,
          loading: false,
        });
      }
    );
  };

  /**
   * Patient rendering
   * @param {object} item
   * @returns {*}
   * @private
   */
  _renderItem = (item) => {
    const {
      itemNavigation,
      model,
      app: { t, user },
    } = this.props;
    const { columns, nodes, isConnected, deviceInfo } = this.state;

    return (
      <ListItem style={styles.item} key={`${item.id}_list`} onPress={async () => itemNavigation(item)}>
        {columns.map((nodeId) => (
          <View style={styles.itemColumn} key={`${item.id}_${nodeId}`}>
            <Text size-auto>{item.getLabelFromNode(nodeId, nodes)}</Text>
          </View>
        ))}
        {model === 'MedicalCase' ? (
          <>
            <View style={styles.itemColumn}>
              <Text size-auto>{t(`medical_case:${item.status}`)}</Text>
            </View>
            {isConnected ? (
              <View style={styles.itemLock}>
                <Text size-auto right>{item.isLocked(deviceInfo, user) ? <Icon name="lock" type="EvilIcons" style={styles.lock} /> : null}</Text>
              </View>
            ) : null}
          </>
        ) : null}
      </ListItem>
    );
  };

  /**
   * Separator between flatList item
   * @returns {*}
   */
  _renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  /**
   * Footer display for "Loading" new content
   * @returns {null|*}
   */
  _renderFooter = () => {
    const {
      app: { t },
    } = this.props;
    const { loading, currentPage, isLastBatch } = this.state;

    if ((!loading && currentPage === 1) || isLastBatch) return null;
    return (
      <View margin-auto>
        <Text center>{t('application:loading')}</Text>
      </View>
    );
  };

  render() {
    const {
      app: { t },
      model,
      navigation,
    } = this.props;
    const { data, firstLoading, columns, nodes, loading, isLastBatch, filters } = this.state;

    return firstLoading ? (
      <LiwiLoader />
    ) : (
      <>
        <View padding-auto style={styles.filterContent}>
          {columns.map((column) => (
            <View key={column} style={styles.columnLabel}>
              <Text size-auto>{nodes[column].label}</Text>
            </View>
          ))}
          {model === 'MedicalCase' ? (
            <View style={styles.columnLabel}>
              <Text size-auto>{t('patient_profile:status')}</Text>
            </View>
          ) : null}
          <Button center red style={styles.filterButton} onPress={() => navigation.navigate('Filters', { model, filters })}>
            <Icon type="FontAwesome" name="filter" />
          </Button>
        </View>
        {data.length > 0 ? (
          <View padding-auto>
            <FlatList
              key="dataList"
              data={data}
              refreshing={loading}
              contentContainerStyle={styles.flatList}
              onRefresh={this._fetchList}
              renderItem={(value) => this._renderItem(value.item)}
              onEndReached={({ distanceFromEnd }) => {
                if (!isLastBatch) {
                  this._handleLoadMore();
                }
              }}
              onEndReachedThreshold={0.01}
              ItemSeparatorComponent={this._renderSeparator}
              keyExtractor={(item) => item.id}
              ListFooterComponent={this._renderFooter}
            />
          </View>
        ) : null}
      </>
    );
  }
}
