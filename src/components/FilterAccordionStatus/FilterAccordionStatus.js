import React, { Component } from 'react';
import * as _ from 'lodash';
import { Text, ListItem, CheckBox, Body } from 'native-base';
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';

import { styles } from './FilterAccordionStatus.style';
import { liwiColors } from '../../utils/constants';
import { medicalCaseStatus } from '../../../frontend_service/constants';

export default class FilterAccordionStatus extends Component {
  render() {
    const {
      handleFilters,
      activeFilters,
      app: { t },
    } = this.props;

    return (
      <Collapse>
        <CollapseHeader style={styles.filterButton}>
          <Text white>{t('filters:status')}</Text>
        </CollapseHeader>
        <CollapseBody style={styles.content}>
          {Object.keys(medicalCaseStatus).map((key) => (
            <ListItem key={key} style={styles.listItem}>
              <CheckBox onPress={() => handleFilters(key)} color={liwiColors.redColor} checked={_.includes(activeFilters.status, medicalCaseStatus[key].name)} />
              <Body>
                <Text size-auto>{t(`medical_case:${medicalCaseStatus[key].name}`)}</Text>
              </Body>
            </ListItem>
          ))}
        </CollapseBody>
      </Collapse>
    );
  }
}
