// @flow
import React, { Component } from 'react';
import { Content, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './HealthCares.style';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCares extends Component<Props, State> {
  render() {
    // eslint-disable-next-line react/prop-types
    const {
      medicalCase,
      app: { t },
    } = this.props;

    // eslint-disable-next-line react/prop-types
    const healthCares = medicalCase.nodes.getHealthCares();

    const { managements, treatments } = healthCares;

    return (
      <Content>
        <Text customTitle>{t('medical_case:managements')}</Text>
        {Object.keys(managements).map((m) => (
          <Text
            style={styles.spaceText}
            size-auto
            key={'healthcare' + managements[m].reference}
          >
            {managements[m].reference} - {managements[m].label}
          </Text>
        ))}
        <Text customTitle>{t('medical_case:treatments')}</Text>
        {Object.keys(treatments).map((t) => (
          <Text
            style={styles.spaceText}
            size-auto
            key={'healthcare' + treatments[t].reference}
          >
            {treatments[t].reference} - {treatments[t].label}
          </Text>
        ))}
      </Content>
    );
  }
}
