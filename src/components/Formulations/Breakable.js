import React from 'react';
import { Text, View } from 'native-base';

import i18n from '../../utils/i18n';
import { LiwiTitle5 } from '../../template/layout';
import { styles } from './styles';
import { administrationRouteCategories } from '../../../frontend_service/constants';
import { breakableFraction, formulationLabel } from '../../../frontend_service/helpers/Drug.model';
import { roundSup } from '../../utils/swissKnives';

export default function Breakable(drug, node, drugDose, algorithmLanguage) {
  const fractionString = breakableFraction(drugDose);

  return (
    <>
      <LiwiTitle5>{node.label[algorithmLanguage]}</LiwiTitle5>
      <Text size-auto>{formulationLabel(drugDose)}</Text>
      {drugDose.by_age ? (
        <Text size-auto>{`${roundSup(drugDose.unique_dose)} ${i18n.t('drug:tablets')} ${i18n.t('medication_form:per_administration')} ${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${i18n.t('drug:during')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
      ) : drugDose.doseResult === null ? (
        <Text size-auto>{drugDose.no_possibility}</Text>
      ) : (
        <View>
          <Text size-auto>
            {`${i18n.t('drug:give')} ${drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)} ${i18n.t('drug:mg')} : ${fractionString} ${i18n.t('drug:tablet')} ${drugDose.dose_form}`}
            {i18n.t('drug:mg')} {drugDose.administration_route_name}
          </Text>
          <Text size-auto>{`${i18n.t('drug:every')} ${drugDose.recurrence} ${i18n.t('drug:h')} ${drug.duration} ${i18n.t('drug:days')}`}</Text>
          <Text size-auto style={styles.description}>
            {drugDose.dispensing_description[algorithmLanguage]}
          </Text>
        </View>
      )}
      {administrationRouteCategories.includes(drugDose.administration_route_category) ? <Text key={`text_${drug.id}`} size-auto>{drugDose.injection_instructions[algorithmLanguage]}</Text> : null}
    </>
  );
}
