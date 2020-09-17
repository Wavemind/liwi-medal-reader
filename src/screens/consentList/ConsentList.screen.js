// @flow

import * as React from 'react';
import { Button, Icon, Input, Item, Text, View } from 'native-base';
import _ from 'lodash';

import { styles } from './ConsentList.style';
import { SeparatorLine } from '../../template/layout';
import ListContent from '../../components/ListContent/ListContent';
import { getItems } from '../../engine/api/LocalStorage';
import { getDeviceInformation } from '../../engine/api/Device';
import { FlatList, TouchableOpacity } from 'react-native';
import { MedicalCaseModel } from '../../../frontend_service/engine/models/MedicalCase.model';
import LiwiLoader from '../../utils/LiwiLoader';

export default class ConsentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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

    const { nodes } = algorithm;
    this.setState({ nodes, firstLoading: false });
  }

  /**
   * Fetch data
   * @returns {Promise<void>}
   */
  _fetchList = async () => {
    const { currentPage } = this.state;

    this.setState({ loading: true });
    // TODO FAIRE LA REQUEST AU SERVEUR
    const data = '';

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
    const { data, currentPage } = this.state;

    this.setState(
      {
        loading: true,
      },
      async () => {
        // TODO: FAIRE LA REQUETE
        const newData = ""
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
    } = this.props;

    return (
      <TouchableOpacity style={styles.item} key={`${item.id}_list`} onPress={async () => itemNavigation(item)}>
        {item.values.map((value, key) => (
          <View style={styles.itemColumn} key={`${item.id}_${key}`}>
            <Text size-auto>{value}</Text>
          </View>
        ))}
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
    } = this.props;
    const { data, firstLoading, nodes, loading, isLastBatch } = this.state;

    return firstLoading ? (
      <LiwiLoader />
    ) : (
      <View>
        <View padding-auto style={styles.filterContent}>
          <View key="first_name" style={styles.columnLabel}>
            {/*<Text size-auto>{nodes[column].label}</Text>*/}
          </View>
          <View key="last_name" style={styles.columnLabel}>
            {/*<Text size-auto>{nodes[column].label}</Text>*/}
          </View>
          <View key="birth_date" style={styles.columnLabel}>
            {/*<Text size-auto>{nodes[column].label}</Text>*/}
          </View>
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
