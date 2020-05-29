import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, View, Button, ListItem, CheckBox, Body } from 'native-base';
import * as _ from 'lodash';

import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';
import { LiwiTitle2 } from '../../template/layout';
import { liwiColors } from '../../utils/constants';
import { styles } from './Filters.style';
import FilterAccordion from '../../components/FilterAccordion';
import { getItems } from '../../engine/api/LocalStorage';
import { categories } from '../../../frontend_service/constants';

export default class Filter extends React.Component<Props, State> {
  state = {
    availableFilters: [],
    activeFilters: {},
  };

  async componentDidMount() {
    const { navigation } = this.props;

    const model = navigation.getParam('model');
    const activeFilters = await navigation.getParam('filters');
    const algorithm = await getItems('algorithm');

    const availableFilters = _.filter(algorithm.nodes, { category: categories.demographic });

    this.setState({ model, availableFilters, activeFilters });
  }

  _handleFilters = async (node, answerKey) => {
    const { activeFilters } = this.state;

    if (_.includes(activeFilters[node.id], node.answers[answerKey].id)) {
      activeFilters[node.id] = _.remove(activeFilters[node.id], (n) => n !== node.answers[answerKey].id);
    } else if (activeFilters[node.id] !== undefined) {
      activeFilters[node.id].push(node.answers[answerKey].id);
    } else {
      activeFilters[node.id] = [node.answers[answerKey].id];
    }
    this.setState({ activeFilters });
  };

  render() {
    const { navigation } = this.props;
    const { model, availableFilters, activeFilters } = this.state;

    return (
      <View padding-auto style={{ flex: 1, marginTop: 50 }}>
        <ScrollView>
          <LiwiTitle2 noBorder>Filters</LiwiTitle2>

          {model === 'MedicalCase' ? (
            <FilterAccordion title="Status" />
          ) : (
            availableFilters.map((node) => (
              <Collapse key={node.id}>
                <CollapseHeader style={styles.filterButton}>
                  <Text white>{node.label}</Text>
                </CollapseHeader>
                <CollapseBody style={styles.content}>
                  {Object.keys(node.answers).map((key) => (
                    <ListItem key={key} style={styles.listItem}>
                      <CheckBox onPress={() => this._handleFilters(node, key)} color={liwiColors.redColor} checked={_.includes(activeFilters[node.id], node.answers[key].id)} />
                      <Body>
                        <Text size-auto>{node.answers[key].label}</Text>
                      </Body>
                    </ListItem>
                  ))}
                </CollapseBody>
              </Collapse>
            ))
          )}
        </ScrollView>

        <View flex-container-row style={{ bottom: 0, left: 0, right: 0, height: 100, position: 'absolute' }}>
          <View w50>
            <Button
              style={{
                left: 0,
                paddingLeft: 0,
                marginLeft: 0,
                width: '95%',
                height: '100%',
                borderRight: 5,
                borderRightColor: liwiColors.darkerGreyColor,
              }}
            >
              <Text size-auto center>
                Clear all
              </Text>
            </Button>
          </View>
          <View w50>
            <Button
              style={{ width: '100%', height: '100%', marginLeft: 0 }}
              onPress={() =>
                navigation.navigate(model === 'MedicalCase' ? 'MedicalCaseList' : 'PatientList', {
                  filters: activeFilters,
                })
              }
            >
              <Text size-auto center>
                Apply
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
