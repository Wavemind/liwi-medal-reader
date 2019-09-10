import React from 'react';
import { Content, Text } from 'native-base';
import { styles } from './HealthCares.style';

export default function HealthCares(props) {
  // eslint-disable-next-line react/prop-types
  const { medicalCase, app: { t } } = props;

  // eslint-disable-next-line react/prop-types
  const healthCares = medicalCase.nodes.getHealthCares();

  const { managements, treatments } = healthCares;

  return (
    <Content>
      <Text>{t('medical_case:healthcares')}</Text>
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
