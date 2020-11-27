import React from 'react';
import { Text, View } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';

export default function Liquid(drug, node, drugDose) {
  const ratio = drugDose.liquid_concentration / drugDose.dose_form;

  return (
    <View>
      <LiwiTitle5>{node.label}</LiwiTitle5>
      <Text>
        {i18n.t('drug:mode')} : {i18n.t(`medication_form:${node.formulations[drug.formulationSelected].medication_form}`)}
      </Text>
      <Text>
        {i18n.t('drug:give')} {ratio * drugDose.doseResult}
        {i18n.t('drug:mg')} : {drugDose.doseResult}
        {i18n.t('drug:ml')} {i18n.t('drug:of')} {drugDose.liquid_concentration}
        {i18n.t('drug:mg')}/{drugDose.dose_form}
        {i18n.t('drug:ml')}
      </Text>
      <Text>{`${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
      <Text size-auto style={{ marginTop: 10 }}>
        {node.formulations[drug.formulationSelected].dispensing_description}
      </Text>
    </View>
  );
}
