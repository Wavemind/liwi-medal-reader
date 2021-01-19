import React from 'react';
import { Text, View } from 'native-base';

import toReadableFraction from '../../utils/toReadableFraction';
import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';
import { styles } from './styles';
import { administrationRouteCategories } from '../../../frontend_service/constants';

export default function Breakable(drug, node, drugDose) {
  //  12 hours for 5 days = recurrence for instance in diagnoses .duration
  let num = null;
  let fractionString = ' ';
  if (drugDose.doseResult !== null) {
    const unit = drugDose.doseResult / drugDose.breakable;
    num = Math.floor(unit);

    const rest = drugDose.doseResult % drugDose.breakable;

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
  }

  return (
    <>
      <LiwiTitle5>{node.label}</LiwiTitle5>
      <Text size-auto>{i18n.t(`medication_form:${node.formulations[drug.formulationSelected].medication_form}`)}</Text>
      {drugDose.by_age ? (
        <Text size-auto>{`${parseInt(drugDose.unique_dose)} ${i18n.t('drug:tablets')} ${i18n.t('medication_form:per_administration')} ${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${i18n.t('drug:during')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
      ) : drugDose.doseResult === null ? (
        <Text size-auto>{drugDose.no_possibility}</Text>
      ) : (
        <View style={styles.container}>
          <Text size-auto>
            {i18n.t('drug:give')} {drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)} {i18n.t('drug:mg')} : {num !== Infinity && num !== 0 ? `${num}` : null}
            {fractionString}
            {num !== Infinity && num > 0 && fractionString !== ' ' && ' '}
            {i18n.t('drug:tablet')}
            {` ${drugDose.dose_form} `}
            {i18n.t('drug:mg')} {drugDose.administration_route_name}
          </Text>
          <Text size-auto>{`${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
          <Text size-auto style={styles.description}>
            {node.formulations[drug.formulationSelected].dispensing_description}
          </Text>
        </View>
      )}
      {administrationRouteCategories.includes(drugDose.administration_route_category) ? <Text key={`text_${drug.id}`}>{drugDose.injection_instructions}</Text> : null}
    </>
  );
}
