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
  };

  async componentDidMount() {
    const { list } = this.props;
    await this.fetchList();

    const algorithm = await getItems('algorithm');

    const columns = algorithm.mobile_config[list];
    const { nodes } = algorithm;

    this.setState({ columns, nodes, firstLoading: false });
  }

  /**
   * Fetch data
   * @returns {Promise<void>}
   */
  fetchList = async () => {
    const {
      app: { database },
      model,
    } = this.props;
    const { currentPage } = this.state;

    this.setState({ loading: true });

    const data = await database.getAll(model, 1);

    this.setState({
      data,
      currentPage: currentPage + 1,
      loading: false,
    });
  };

  /**
   * Separator between flatList item
   * @returns {*}
   */
  _renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  /**
   * Patient rendering
   * @param {object} item
   * @returns {*}
   * @private
   */
  _renderPatient = (item) => {
    const { navigation, itemNavigation } = this.props;
    const { columns } = this.state;
    const size = 1 / columns.length;

    return (
      <ListItem
        style={styles.item}
        key={`${item.id}_list`}
        onPress={() =>
          navigation.navigate(itemNavigation, {
            id: item.id,
          })
        }
      >
        {columns.map((column) => (
          <View style={{ flex: size }}>
            <Text size-auto>{}</Text>
          </View>
        ))}
      </ListItem>
    );
  };

  /**
   * Load more item to display
   * @private
   */
  _handleLoadMore = () => {
    const {
      app: { database },
      model,
    } = this.props;
    const { data, currentPage } = this.state;

    this.setState(
      {
        loading: true,
      },
      async () => {
        const newData = await database.getAll(model, currentPage);
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
      navigation,
    } = this.props;
    const { data, firstLoading, columns, nodes, loading, isLastBatch } = this.state;

    return firstLoading ? (
      <LiwiLoader />
    ) : data.length > 0 ? (
      <>
        <View padding-auto style={styles.filterContent}>
          {columns.map((column) => (
            <Button iconRight center light style={[{ flex: 1 / columns.length }, styles.sortButton]}>
              <Text>{nodes[column].label}</Text>
              <Icon name="arrow-up" />
            </Button>
          ))}
          <Button center red style={styles.filterButton} onPress={() => navigation.navigate('Filter')}>
            <Icon type="FontAwesome" name="filter" />
          </Button>
        </View>
        <View padding-auto>
          <FlatList
            key="dataList"
            data={data}
            refreshing={loading}
            contentContainerStyle={styles.flatList}
            onRefresh={this.fetchList}
            renderItem={(value) => this._renderPatient(value.item)}
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
      </>
    ) : (
      <View padding-auto margin-auto>
        <Text not-available>{t('application:no_data')}</Text>
      </View>
    );
  }
}
