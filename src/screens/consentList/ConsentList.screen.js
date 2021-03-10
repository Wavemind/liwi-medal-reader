// @flow

import * as React from 'react';
import { Text, View } from 'native-base';

import { FlatList, TouchableOpacity } from 'react-native';
import { styles } from './ConsentList.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { modalType } from '../../../frontend_service/constants';
import { translateText } from '../../utils/i18n';

export default class ConsentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      nodes: {},
      data: [],
      columns: props.app.algorithm.mobile_config.patient_list,
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
    const {
      app: { database },
    } = this.props;
    const { currentPage, columns } = this.state;

    this.setState({ loading: true });
    const data = await database.getConsentsFile(currentPage, columns);

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
    } = this.props;
    const { data, currentPage, columns } = this.state;

    this.setState(
      {
        loading: true,
      },
      async () => {
        const newData = await database.getConsentsFile(currentPage, columns);
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
   * Display consent file in modal
   * @param consentFile
   * @param title
   */
  consentModal = (consentFile, title) => {
    const { updateModalFromRedux } = this.props;
    updateModalFromRedux({ consentFile, title }, modalType.consentFile);
  };

  /**
   * Patient rendering
   * @param {object} item
   * @returns {*}
   * @private
   */
  _renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.item} key={`${item.id}_list`} onPress={() => this.consentModal(item.consent_file, item.values.join(' - '))}>
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
      app: { t, algorithmLanguage },
    } = this.props;
    const { data, firstLoading, columns, nodes, loading, isLastBatch } = this.state;

    return firstLoading ? (
      <LiwiLoader />
    ) : (
      <View>
        <View padding-auto style={styles.filterContent}>
          {columns.map((column) => (
            <View key={column} style={styles.columnLabel}>
              <Text size-auto>{translateText(nodes[column].label, algorithmLanguage)}</Text>
            </View>
          ))}
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
