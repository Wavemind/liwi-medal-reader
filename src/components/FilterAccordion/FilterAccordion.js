import React, { Component } from 'react';
import * as _ from 'lodash';
import { Text, ListItem, CheckBox, Body } from 'native-base';
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';

import { styles } from './FilterAccordion.style';
import { liwiColors } from '../../utils/constants';
import { translateText } from '../../utils/i18n';

export default class FilterAccordion extends Component {
  render() {
    const { node, handleFilters, activeFilters, app: { algorithmLanguage} } = this.props;

    return (
      <Collapse key={node.id}>
        <CollapseHeader style={styles.filterButton}>
          <Text white>{translateText(node.label, algorithmLanguage)}</Text>
        </CollapseHeader>
        <CollapseBody style={styles.content}>
          {Object.keys(node.answers).map((key) => (
            <ListItem key={key} style={styles.listItem}>
              <CheckBox onPress={() => handleFilters(node, key)} color={liwiColors.redColor} checked={_.includes(activeFilters[node.id], node.answers[key].id)} />
              <Body>
                <Text size-auto>{translateText(node.answers[key].label, algorithmLanguage)}</Text>
              </Body>
            </ListItem>
          ))}
        </CollapseBody>
      </Collapse>
    );
  }
}
