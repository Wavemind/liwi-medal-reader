// @flow
import React from 'react';
import { Body, Card, CardItem, Text, View } from 'native-base';

import Medicine from '../Medicine';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './MedicineSelection.style';
import {
  finalDiagnosticGetDrugs,
  finalDiagnosticGetManagements,
} from '../../../frontend_service/engine/models/FinalDiagnostic.model';

export default function MedicineSelection(props) {
  const { t, diagnosesFinalDiagnostic, medicalCase, diagnoseKey } = props;

  const finalDiagnostic = medicalCase.nodes[diagnosesFinalDiagnostic.id];
  const drugs = finalDiagnosticGetDrugs(medicalCase, finalDiagnostic);
  const managements = finalDiagnosticGetManagements(medicalCase, finalDiagnostic);

  return (
    <Card key={`finalDiagnostic_${diagnosesFinalDiagnostic.id}`}>
      <CardItem style={styles.cardItemCondensed}>
        <View style={styles.cardTitleContent}>
          <Text customSubTitle style={styles.cardTitle}>
            {diagnosesFinalDiagnostic.label}
          </Text>
          <LiwiTitle2 noBorder style={styles.noRightMargin}>
            <Text note>{t(`diagnoses_label:${diagnoseKey}`)}</Text>
          </LiwiTitle2>
        </View>
      </CardItem>
      <CardItem style={styles.cardItemCondensed}>
        <Body>
          <LiwiTitle2 noBorder style={styles.cardTitle}>
            {t('diagnoses:drugs')}
          </LiwiTitle2>
          {drugs.length > 0 ? (
            drugs.map((drug) => (
              <Medicine
                healthCareType="drugs"
                diagnoseKey={diagnoseKey}
                key={`${diagnosesFinalDiagnostic.id}_${drug.id}_medicine`}
                medicine={diagnosesFinalDiagnostic.drugs[drug.id]}
                finalDiagnosticId={diagnosesFinalDiagnostic.id}
                node={drug}
              />
            ))
          ) : (
            <Text style={styles.padding} key={`${diagnoseKey}_diagnoses`} italic>
              {t('diagnoses:no_drugs')}
            </Text>
          )}
          <LiwiTitle2 noBorder style={styles.cardTitle}>
            {t('diagnoses:management')}
          </LiwiTitle2>
          {managements.length > 0 ? (
            managements.map((management) => (
              <Medicine
                healthCareType="managements"
                diagnoseKey={diagnoseKey}
                key={`${diagnosesFinalDiagnostic.id}_${management.id}_medicine`}
                medicine={diagnosesFinalDiagnostic.managements[management.id]}
                finalDiagnosticId={diagnosesFinalDiagnostic.id}
                node={management}
              />
            ))
          ) : (
            <Text style={styles.padding} key={`${diagnoseKey}_diagnoses`} italic>
              {t('diagnoses:no_managements')}
            </Text>
          )}
        </Body>
      </CardItem>
    </Card>
  );
}
