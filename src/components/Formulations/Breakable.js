import React from 'react';
import { Text } from 'native-base';

import toReadableFraction from '../../utils/toReadableFraction';
import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';

export default function Breakable(drug, node, drugDose) {
  //  12 hours for 5 days = recurrence for instance in diagnoses .duration
  const unit = drugDose.doseResult / drugDose.breakable;
  const num = Math.floor(unit);

  const rest = drugDose.doseResult % drugDose.breakable;
  let fractionString = ' ';
  if (rest !== 0) {
    const r = toReadableFraction(rest / drugDose.breakable);
    if (r.numerator === 1 && r.denominator === 2) {
      fractionString = '½ ';
    } else if (r.numerator === 1 && r.denominator === 4) {
      fractionString = '¼ ';
    } else if (r.numerator === 3 && r.denominator === 4) {
      fractionString = '¾ ';
    } else {
      // other fraction
      fractionString = `${r.numerator} / ${r.denominator}`;
    }
  }

  return (
    <>
      <LiwiTitle5>{node.label}</LiwiTitle5>
      <Text size-auto>
        {i18n.t('drug:mode')} : {drug.formulationSelected}
      </Text>
      {drugDose.doseResult === null ? (
        <Text size-auto>{drugDose.no_possibility}</Text>
      ) : (
        <>
          <Text size-auto>
            {i18n.t('drug:give')} {drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)} {i18n.t('drug:mg')} : {num !== Infinity && num !== 0 ? `${num}` : null}
            {fractionString}
            {num !== Infinity && num > 0 && fractionString !== ' ' && ' '}
            {i18n.t('drug:tablet')}
            {` ${drugDose.dose_form} `}
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
