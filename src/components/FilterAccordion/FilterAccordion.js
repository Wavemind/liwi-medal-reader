import React, { Component } from 'react';
import * as _ from 'lodash';
import { Text, ListItem, CheckBox, Body } from 'native-base';
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';

import { styles } from './FilterAccordion.style';
import { liwiColors } from '../../utils/constants';

export default class FilterAccordion extends Component {
  render() {
    const { node, handleFilters, activeFilters } = this.props;

    return (
      <Collapse key={node.id}>
        <CollapseHeader style={styles.filterButton}>
          <Text white>{node.label}</Text>
        </CollapseHeader>
        <CollapseBody style={styles.content}>
          {Object.keys(node.answers).map((key) => (
            <ListItem key={key} style={styles.listItem}>
              <CheckBox onPress={() => handleFilters(node, key)} color={liwiColors.redColor} checked={_.includes(activeFilters[node.id], node.answers[key].id)} />
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
