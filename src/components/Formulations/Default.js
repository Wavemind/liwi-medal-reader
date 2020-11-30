import React from 'react';
import { Text } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';
import { styles } from './styles';

export default function Default(drug, node, drugDose) {
  let every = '';

  if (drug.formulationSelected !== null) {
    every = `${i18n.t('drug:every')} ${24 / drugDose.doses_per_day} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`;
  }

  return (
    <>
      <LiwiTitle5>{node.label}</LiwiTitle5>
      <Text size-auto>
        {i18n.t('drug:mode')} : {drug.formulationSelected === null ? i18n.t('drug:no_formulation') : i18n.t(`medication_form:${node.formulations[drug.formulationSelected].medication_form}`)}
      </Text>
      <Text size-auto>
        {i18n.t('drug:d')} : {drug.duration}
      </Text>
      {drug.formulationSelected !== null && (
        <Text size-auto>
          {i18n.t('drug:admin')} : {drugDose.administration_route_name}
        </Text>
      )}
      {drug.formulationSelected !== null && <Text>{every}</Text>}
      <Text size-auto style={styles.description}>
        {node.formulations[drug.formulationSelected].dispensing_description}
      </Text>
    </>
  );
}
