import React, { Component } from 'react';
import * as _ from 'lodash';
import { Text, ListItem, CheckBox, Body } from 'native-base';
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';

import { styles } from './FilterAccordion.style';
import { liwiColors } from '../../utils/constants';

export default class FilterAccordion extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const listFilters = navigation.getParam('listFilters');
    this.setState({ listFilters });
  }

  _handleFilters = async (node, answerKey) => {
    const { listFilters } = this.state;
    let newListFilters = listFilters;

    if (_.includes(listFilters[node.id], node.answers[answerKey].id)) {
      newListFilters = _.remove(listFilters[node.id], node.answers[answerKey].id);
    } else if (newListFilters[node.id] !== undefined) {
      newListFilters[node.id].push(node.answers[answerKey].id);
    } else {
      newListFilters[node.id] = [node.answers[answerKey].id];
    }

    this.setState({ listFilters: newListFilters });
  };

  render() {
    const { node } = this.props;
    const { listFilters } = this.state;

    return (
      <Collapse>
        <CollapseHeader style={styles.filterButton}>
          <Text white>{node.label}</Text>
        </CollapseHeader>
        <CollapseBody style={styles.content}>
          {Object.keys(node.answers).map((key) => (
            <ListItem key={key} style={styles.listItem}>
              <CheckBox onPress={() => this._handleFilters(node, key)} color={liwiColors.redColor} checked={_.includes(listFilters[node.id], node.answers[key].id)} />
              <Body>
                <Text size-auto>{node.answers[key].label}</Text>
              </Body>
            </ListItem>
          ))}
        </CollapseBody>
      </Collapse>
    );
  }
}
