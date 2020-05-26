// @flow

import * as React from 'react';
import { FlatList } from 'react-native';
import { Button, Picker, ListItem, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { getItems } from '../../engine/api/LocalStorage';
import { styles } from './ListContent.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { medicalCaseStatus } from '../../../frontend_service/constants';

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
  };

  async componentDidMount() {
    const { list } = this.props;

    await this._fetchList();

    const algorithm = await getItems('algorithm');

    const columns = algorithm.mobile_config[list];
    const { nodes } = algorithm;
    this.setState({ columns, nodes, firstLoading: false });
  }

  async componentDidUpdate(nextProp, nextState){
    // Update the list whenever the search query is updated
    if (nextProp.query !== this.props.query) {
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
    const { currentPage, status } = this.state;

    this.setState({ loading: true });
    const options = {
      query,
      filter: status !== null ? { key: 'status', value: status } : null,
    };
    const data = await database.getAll(model, 1, options);

    this.setState({
      data,
      currentPage: currentPage + 1,
      loading: false,
      isLastBatch: false,
    });
  };

  /**
   * Filter by status
   * @param {string} value - Change status type
   * @private
   */
  _changeStatus = (value) => {
    this.setState({ status: value });
    this._fetchList();
  };

  /**
   * Load more item to display
   * @private
   */
  _handleLoadMore = () => {
    const {
      app: { database },
      model,
      query
    } = this.props;
    const { data, currentPage, status } = this.state;

    this.setState(
      {
        loading: true,
      },
      async () => {
        const options = {
          query,
          filter: status !== null ? { key: 'status', value: status } : null,
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
    const { navigation, itemNavigation } = this.props;
    const { columns, nodes } = this.state;
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
        {columns.map((nodeId) => (
          <View style={{ flex: size }} key={`${item.id}_${nodeId}`}>
            <Text size-auto>{item.getLabelFromPatientValue(nodeId, nodes)}</Text>
          </View>
        ))}
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
    } = this.props;
    const { model, data, firstLoading, columns, nodes, loading, isLastBatch, status } = this.state;

    return firstLoading ? (
      <LiwiLoader />
    ) : data.length > 0 ? (
      <>
        <View padding-auto style={styles.filterContent}>
          {columns.map((column) => (
            <Button key={column} iconRight center light style={[{ flex: 1 / columns.length }, styles.sortButton]}>
              <Text>{nodes[column].label}</Text>
            </Button>
          ))}
          {model === 'MedicalCase' ? (
          <View style={styles.filterButton}>
            <Picker mode="dropdown" note={false} style={styles.picker} selectedValue={status} onValueChange={(value) => this._changeStatus(value)}>
              <Picker.Item label={t('application:select')} value={null} />
              {Object.keys(medicalCaseStatus).map((key) => (
                <Picker.Item label={t(`medical_case:${medicalCaseStatus[key].name}`)} value={medicalCaseStatus[key].name} />
              ))}
            </Picker>
          </View>
          ) : null}
        </View>
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
      </>
    ) : (
      <View padding-auto margin-auto>
        <Text not-available>{t('application:no_data')}</Text>
      </View>
    );
  }
}
