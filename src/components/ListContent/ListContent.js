// @flow

import * as React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, View, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';

import { styles } from './ListContent.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { getDeviceInformation } from '../../engine/api/Device';
import { MedicalCaseModel } from '../../../frontend_service/helpers/MedicalCase.model';

type Props = NavigationScreenProps & {};

type State = {};

export default class ListContent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      columns: props.app.algorithm.mobile_config[props.list],
      nodes: {},
      data: [],
      currentPage: 1,
      isLastBatch: false,
      firstLoading: true,
    };
  }

  async componentDidMount() {
    const {
      app: { algorithm },
    } = this.props;

    await this._fetchList();

    const deviceInfo = await getDeviceInformation();

    const { nodes } = algorithm;
    this.setState({ nodes, firstLoading: false, deviceInfo });
  }

  async componentDidUpdate(nextProps) {
    const { model, query } = this.props;

    if (nextProps.query !== query || nextProps.app[`filters${model}`] !== this.props.app[`filters${model}`] || this.props.app.isConnected !== nextProps.app.isConnected) {
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
    const { currentPage, columns } = this.state;

    const filters = this.props.app[`filters${model}`];

    this.setState({ loading: true });
    const options = { query, filters, columns };
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
    const { data, currentPage, columns } = this.state;
    const filters = this.props.app[`filters${model}`];

    this.setState(
      {
        loading: true,
      },
      async () => {
        const options = {
          query,
          filters,
          columns,
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
      app: { t, user, isConnected },
    } = this.props;
    const { deviceInfo } = this.state;
    return (
      <TouchableOpacity style={styles.item} key={`${item.id}_list`} onPress={async () => itemNavigation(item)}>
        {item.values.map((value, key) => (
          <View style={styles.itemColumn} key={`${item.id}_${key}`}>
            <Text size-auto>{value}</Text>
          </View>
        ))}
        {model === 'Patient' ? (
          <View style={styles.itemColumn}>
            <Text size-auto>{moment(item.updated_at).format(t('application:date_format'))}</Text>
            <Text size-auto>{moment(item.updated_at).format('HH:mm')}</Text>
          </View>
        ) : null}
        {model === 'MedicalCase' ? (
          <>
            <View style={styles.itemColumn}>
              <Text size-auto>{t(`medical_case:${item.status}`)}</Text>
            </View>
            {isConnected ? (
              <View style={styles.itemLock}>
                <Text size-auto right>
                  {MedicalCaseModel.isLocked(item, deviceInfo, user) ? <Icon name="lock" type="EvilIcons" style={styles.lock} /> : null}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}
      </TouchableOpacity>
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
      <View>
        <View padding-auto style={styles.filterContent}>
          {columns.map((column) => (
            <View key={column} style={styles.columnLabel}>
              <Text size-auto>{nodes[column].label}</Text>
            </View>
          ))}
          {model === 'Patient' ? (
            <View style={styles.columnLabel}>
              <Text size-auto>{t('patient_profile:date')}</Text>
            </View>
          ) : null}
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
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('application:no_data')}</Text>
          </View>
        )}
      </View>
    );
  }
}
