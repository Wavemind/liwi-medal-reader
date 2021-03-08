import React from 'react';
import { Text } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';
import { styles } from './styles';
import { administrationRouteCategories } from '../../../frontend_service/constants';
import { formulationLabel } from '../../../frontend_service/helpers/Drug.model';

export default function Default(drug, node, drugDose, algorithmLanguage) {
  let every = '';

  if (drug.formulationSelected !== null) {
    every = `${i18n.t('drug:every')} ${24 / drugDose.doses_per_day} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`;
  }

  return (
    <>
      <LiwiTitle5>{node.label[algorithmLanguage]}</LiwiTitle5>
      <Text size-auto>{formulationLabel(drugDose)}</Text>
      <Text size-auto>
        {i18n.t('drug:d')}: {drug.duration}
      </Text>
      {drug.formulationSelected !== null && (
        <Text size-auto>
          {i18n.t('drug:admin')}: {drugDose.administration_route_name}
        </Text>
      )}
      {drug.formulationSelected !== null && <Text>{every}</Text>}
      <Text size-auto style={styles.description}>
        {drugDose.dispensing_description[algorithmLanguage]}
      </Text>
      {administrationRouteCategories.includes(drugDose.administration_route_category) ? <Text key={`text_${drug.id}`} size-auto>{drugDose.injection_instructions[algorithmLanguage]}</Text> : null}
    </>
  );
}
