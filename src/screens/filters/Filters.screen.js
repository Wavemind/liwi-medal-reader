import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, View, Button } from 'native-base';
import * as _ from 'lodash';

import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Filters.style';
import FilterAccordion from '../../components/FilterAccordion';
import { getItem } from '../../engine/api/LocalStorage';
import { categories, medicalCaseStatus } from '../../../frontend_service/constants';
import FilterAccordionStatus from '../../components/FilterAccordionStatus';

export default class Filter extends React.Component<Props, State> {
  state = {
    availableFilters: [],
    activeFilters: {},
  };

  async componentDidMount() {
    const { navigation } = this.props;

    const model = navigation.getParam('model');
    const filters = this.props.app[`filters${model}`];
    // TODO: Find better solutions
    const activeFilters = JSON.parse(JSON.stringify(filters));

    const algorithm = await getItem('algorithm');
    const availableFilters = _.filter(algorithm.nodes, { category: categories.demographic });

    this.setState({ model, availableFilters, activeFilters });
  }

  /**
   * Add or remove filters and set value in activeFilter
   * @param {Object} node - Node list
   * @param {Integer} answerKey - Answer keys
   * @returns {Promise<void>}
   * @private
   */
  handleFilters = async (node, answerKey) => {
    const { activeFilters } = this.state;

    if (_.includes(activeFilters[node.id], node.answers[answerKey].id)) {
      activeFilters[node.id] = _.remove(activeFilters[node.id], (n) => n !== node.answers[answerKey].id);
      // Remove filter key if there is no value set
      if (activeFilters[node.id].length === 0) {
        delete activeFilters[node.id];
      }
    } else if (activeFilters[node.id] !== undefined) {
      activeFilters[node.id].push(node.answers[answerKey].id);
    } else {
      activeFilters[node.id] = [node.answers[answerKey].id];
    }
    this.setState({ activeFilters });
  };

  /**
   * Add or remove status filters for medicalCase in activeFilter
   * @param {String} statusKey - Key of medicalCaseStatus constant
   * @returns {Promise<void>}
   */
  handleStatusFilters = async (statusKey) => {
    const { activeFilters } = this.state;

    if (_.includes(activeFilters.status, medicalCaseStatus[statusKey].name)) {
      activeFilters.status = _.remove(activeFilters.status, (n) => n !== medicalCaseStatus[statusKey].name);
      // Remove filter key if there is no value set
      if (activeFilters.status.length === 0) {
        delete activeFilters.status;
      }
    } else if (activeFilters.status !== undefined) {
      activeFilters.status.push(medicalCaseStatus[statusKey].name);
    } else {
      activeFilters.status = [medicalCaseStatus[statusKey].name];
    }
    this.setState({ activeFilters });
  };

  /**
   * Save filter in context and redirect to patient or medical case list
   * @returns {Promise<void>}
   * @private
   */
  _saveFilters = async () => {
    const {
      navigation,
      app: { set },
    } = this.props;
    const { activeFilters, model } = this.state;

    await set(`filters${model}`, activeFilters);
    navigation.navigate(model === 'MedicalCase' ? 'MedicalCaseList' : 'PatientList');
  };

  /**
   * Clear filter in context and redirect to patient or medical case list
   * @returns {Promise<void>}
   * @private
   */
  _clearFilter = async () => {
    const {
      navigation,
      app: { set },
    } = this.props;
    const { model } = this.state;

    await set(`filters${model}`, {});
    navigation.navigate(model === 'MedicalCase' ? 'MedicalCaseList' : 'PatientList');
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { model, availableFilters, activeFilters } = this.state;

    return (
      <View padding-auto style={styles.container}>
        <View style={styles.filtersHeight}>
          <ScrollView>
            <LiwiTitle2 noBorder>{t('filters:title')}</LiwiTitle2>

            {model === 'MedicalCase' ? (
              <FilterAccordionStatus key="accordion-medicalCase" activeFilters={activeFilters} handleFilters={this.handleStatusFilters} />
            ) : (
              availableFilters.map((node) => <FilterAccordion key={`accordion-${node.id}`} node={node} activeFilters={activeFilters} handleFilters={this.handleFilters} />)
            )}
          </ScrollView>
        </View>

        <View flex-container-row style={styles.bottomButton}>
          <View w50>
            <Button style={styles.clearAll} onPress={() => this._clearFilter()}>
              <Text size-auto center>
                {t('filters:clear')}
              </Text>
            </Button>
          </View>
          <View w50>
            <Button style={styles.apply} onPress={() => this._saveFilters()}>
              <Text size-auto center>
                {t('filters:apply')}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
