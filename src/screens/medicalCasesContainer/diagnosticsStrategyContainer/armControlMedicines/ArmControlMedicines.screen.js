// @flow
import React, { Component } from 'react';
import { Text, View } from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import * as _ from 'lodash';

import { liwiColors } from '../../../../utils/constants';
import { styles } from './ArmControlMedicines.style';
import { categories } from '../../../../../frontend_service/constants';

export default class ArmControlMedicines extends Component {
  /**
   * Set additional medicine in medical case
   * @param {Array} selectedItems - List of all additional item selected
   */
  onSelectedItemsChange = (selectedItems) => {
    const {
      setAdditionalMedicine,
      setAdditionalManagement,
      medicalCase: { nodes },
      app: {
        algorithm,
        algorithm: { diagnostics },
      },
    } = this.props;

    const objMedicine = {};

    selectedItems.forEach((i) => {
      let duration = 0;

      // Get max duration from final_diagnostics
      Object.keys(diagnostics).forEach((id) => {
        Object.keys(diagnostics[id].final_diagnostics).forEach((finalDiagnosticId) => {
          if (diagnostics[id].final_diagnostics[finalDiagnosticId].drugs[i]?.duration > duration) {
            duration = diagnostics[id].final_diagnostics[finalDiagnosticId].drugs[i].duration;
          }
        });
      });

      objMedicine[i] = nodes[i];
      objMedicine[i].agreed = true;
      objMedicine[i].duration = duration;
    });

    if (algorithm.nodes[Object.keys(objMedicine)[0]].category === categories.drug) {
      setAdditionalMedicine(objMedicine);
    } else {
      setAdditionalManagement(objMedicine);
    }
  };

  render() {
    const {
      medicalCase: { diagnoses },
      app: { t, algorithm },
    } = this.props;

    // Need this shit when closing a medical otherwise it crash
    if (diagnoses === undefined) {
      return null;
    }

    const drugsList = _.filter(algorithm.nodes, (f) => f.category === categories.drug);
    const selectedDrugs = Object.keys(diagnoses.additionalDrugs).map((s) => diagnoses.additionalDrugs[s].id);

    const managementsList = _.filter(algorithm.nodes, (f) => f.category === categories.management);
    const selectedManagements = Object.keys(diagnoses.additionalManagements).map((s) => diagnoses.additionalManagements[s].id);

    return (
      <View>
        <Text customTitle style={styles.noTopMargin}>
          {t('diagnoses:medicines')}
        </Text>

        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:additional_drugs')}
        </Text>
        {Object.keys(diagnoses.additionalDrugs).length > 0 ? (
          Object.keys(diagnoses.additionalDrugs).map((additionalKey) => (
            <Text key={`additional-${additionalKey}`} style={styles.additionalText}>
              {algorithm.nodes[additionalKey].label}
            </Text>
          ))
        ) : (
          <Text italic>{t('diagnoses:no_additional_drugs')}</Text>
        )}

        <Text customTitle>{t('diagnoses:add_drugs')}</Text>

        <MultiSelect
          hideTags
          items={drugsList}
          uniqueKey="id"
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedDrugs}
          selectText={t('diagnoses:select')}
          searchInputPlaceholderText={t('diagnoses:search')}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          textInputProps={{ autoFocus: false }}
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor={liwiColors.redColor}
          itemTextColor="#000"
          itemFontSize={15}
          styleRowList={styles.rowStyle}
          displayKey="label"
          searchInputStyle={styles.searchInputStyle}
          submitButtonColor={liwiColors.redColor}
          submitButtonText={t('diagnoses:close')}
        />

        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:additional_managements')}
        </Text>
        {Object.keys(diagnoses.additionalManagements).length > 0 ? (
          Object.keys(diagnoses.additionalManagements).map((additionalKey) => (
            <Text key={`additional-${additionalKey}`} style={styles.additionalText}>
              {algorithm.nodes[additionalKey].label}
            </Text>
          ))
        ) : (
          <Text italic>{t('diagnoses:no_additional_managements')}</Text>
        )}

        <Text customTitle>{t('diagnoses:add_managements')}</Text>

        <MultiSelect
          hideTags
          items={managementsList}
          uniqueKey="id"
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedManagements}
          selectText={t('diagnoses:select')}
          searchInputPlaceholderText={t('diagnoses:search')}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          textInputProps={{ autoFocus: false }}
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor={liwiColors.redColor}
          itemTextColor="#000"
          itemFontSize={15}
          styleRowList={styles.rowStyle}
          displayKey="label"
          searchInputStyle={styles.searchInputStyle}
          submitButtonColor={liwiColors.redColor}
          submitButtonText={t('diagnoses:close')}
        />
      </View>
    );
  }
}
