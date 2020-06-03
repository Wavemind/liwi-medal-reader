import React from 'react';
import { Text } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle4 } from '../../template/layout';

export default function Liquid(drug, node, drugDose) {
  const ratio = drugDose.liquid_concentration / drugDose.dose_form;
  return (
    <>
      <LiwiTitle4>{node.label}</LiwiTitle4>
      <Text>
        {i18n.t('drug:mode')} : {drug.formulationSelected}
      </Text>
      <Text>
        {i18n.t('drug:give')} {ratio * drugDose.doseResult}
        {i18n.t('drug:mg')} : {drugDose.doseResult}
        {i18n.t('drug:mf')} {i18n.t('drug:of')} {drugDose.liquid_concentration}
        {i18n.t('drug:mg')}/{drugDose.dose_form}
        {i18n.t('drug:ml')}
      </Text>
      <Text>
        {i18n.t('drug:every')} {drugDose.recurrence} {i18n.t('drug:h')} {drug.duration} {i18n.t('drug:days')}
      </Text>
    </>
  );
}
