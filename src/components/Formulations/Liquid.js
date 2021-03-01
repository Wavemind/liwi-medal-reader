import React from 'react';
import { Text, View } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';
import { styles } from './styles';
import { administrationRouteCategories } from '../../../frontend_service/constants';

export default function Liquid(drug, node, drugDose) {
  const ratio = drugDose.liquid_concentration / drugDose.dose_form;

  return (
    <View>
      <LiwiTitle5>{node.label}</LiwiTitle5>
      <Text size-auto>{i18n.t(`medication_form:${node.formulations[drug.formulationSelected].medication_form}`)}</Text>
      {drugDose.by_age ? (
        <Text size-auto>{`${drugDose.unique_dose}ml ${i18n.t('medication_form:per_administration')} ${i18n.t('drug:during')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
      ) : drugDose.doseResult === null ? (
        <Text size-auto>{drugDose.no_possibility}</Text>
      ) : (
        <View style={styles.container}>
          <Text>
            {i18n.t('drug:give')} {ratio * drugDose.doseResult}
            {i18n.t('drug:mg')}: {drugDose.doseResult}
            {i18n.t('drug:ml')} {i18n.t('drug:of')} {drugDose.liquid_concentration}
            {i18n.t('drug:mg')}/{drugDose.dose_form}
            {i18n.t('drug:ml')}
          </Text>
          <Text>{`${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
          <Text size-auto style={styles.description}>
            {drugDose.dispensing_description}
          </Text>
        </View>
      )}
      {administrationRouteCategories.includes(drugDose.administration_route_category) ? <Text key={`text_${drug.id}`}>{drugDose.injection_instructions}</Text> : null}
    </View>
  );
}
