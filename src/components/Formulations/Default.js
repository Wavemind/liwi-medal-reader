import React from 'react';
import { Text } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle4 } from '../../template/layout';

export default function Default(drug, node, drugDose) {
  let every = '';

  if (drug.formulationSelected !== null) {
    every = `${i18n.t('drug:every')} ${24 / drugDose.doses_per_day} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`;
  }
  return (
    <>
      <LiwiTitle4>{node.label}</LiwiTitle4>
      <Text>
        {i18n.t('drug:mode')} : {drug.formulationSelected === null ? i18n.t('drug:no_formulation') : drug.formulationSelected}
      </Text>
      <Text>
        {i18n.t('drug:d')} : {drug.duration}
      </Text>
      {drug.formulationSelected !== null && (
        <Text>
          {i18n.t('drug:admin')} : {drugDose.administration_route_name}
        </Text>
      )}
      {drug.formulationSelected !== null && <Text>{every}</Text>}
    </>
  );
}
