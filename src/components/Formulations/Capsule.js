import React from 'react';
import { Text } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';

export default function Capsule(drug, node, drugDose) {
  return (
    <>
      <LiwiTitle5>{node.label}</LiwiTitle5>
      <Text size-auto>{i18n.t('drug:mode')} : {i18n.t(`medication_form:${node.formulations[drug.formulationSelected].medication_form}`)}</Text>
      {drugDose.doseResult === null ? (
        <Text>{drugDose.no_possibility}</Text>
      ) : (
        <>
          <Text size-auto>
            {i18n.t('drug:give')} {drugDose.doseResult * drugDose.dose_form} {i18n.t('drug:mg')} : {drugDose.doseResult} {i18n.t('drug:caps')} {drugDose.dose_form}
            {i18n.t('drug:mg')} {drugDose.administration_route_name}
          </Text>
          <Text size-auto>
            {`${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`}
          </Text>
        </>
      )}
    </>
  );
}
