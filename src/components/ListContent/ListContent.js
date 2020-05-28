// @flow

import * as React from 'react';
import { FlatList } from 'react-native';
import { Button, Icon, ListItem, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { getItems } from '../../engine/api/LocalStorage';
import { styles } from './ListContent.style';
import LiwiLoader from '../../utils/LiwiLoader';

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
    filters: {}
  };

  async componentDidMount() {
    const { list } = this.props;

    await this._fetchList();

    const algorithm = await getItems('algorithm');
    const filters = await getItems('filters');
console.log(filters);
    const columns = algorithm.mobile_config[list];
    const { nodes } = algorithm;
    this.setState({ columns, nodes, firstLoading: false, filters: filters === undefined ? {} : filters });
  }

  async componentDidUpdate(nextProps) {
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
      app: { t },
    } = this.props;
    const { columns, nodes } = this.state;
    const size = 1 / columns.length;

    return (
      <ListItem style={styles.item} key={`${item.id}_list`} onPress={async () => itemNavigation(item)}>
        {columns.map((nodeId) => (
          <View style={{ flex: size }} key={`${item.id}_${nodeId}`}>
            <Text size-auto>{item.getLabelFromNode(nodeId, nodes)}</Text>
          </View>
        ))}
        {model === 'MedicalCase' ? (
          <View style={{ flex: size }}>
            <Text size-auto>{t(`medical_case:${item.status}`)}</Text>
          </View>
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
    const { data, firstLoading, columns, nodes, loading, isLastBatch } = this.state;

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
          <Button center red style={styles.filterButton} onPress={() => navigation.navigate('Filters', { model })}>
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
