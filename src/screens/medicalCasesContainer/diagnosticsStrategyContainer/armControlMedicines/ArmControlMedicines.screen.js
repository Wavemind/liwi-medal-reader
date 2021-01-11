// @flow
import React, { Component } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { Icon, Text, View } from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import * as _ from 'lodash';

import { liwiColors } from '../../../../utils/constants';
import { styles } from './ArmControlMedicines.style';
import { categories, modalType } from '../../../../../frontend_service/constants';

export default class ArmControlMedicines extends Component {
  /**
   * Set additional medicine in medical case
   * @param {Array} selectedItems - List of all additional item selected
   */
  onSelectedItemsChange = (selectedItems, type) => {
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
    if (type === categories.drug) {
      setAdditionalMedicine(objMedicine);
    } else {
      setAdditionalManagement(objMedicine);
    }
  };

  /**
   * Set duration value for custom medicine
   * @param {Integer} value
   * @param {Integer} id
   * @private
   */
  _changeCustomDuration = (value, id) => {
    const reg = new RegExp(/^\d+$/);

    const { setAdditionalMedicineDuration } = this.props;
    if (reg.test(value) || value === '') {
      setAdditionalMedicineDuration(id, value);
    }
  };

  /**
   * Open redux modal
   */
  openModal = (questionId) => {
    const {
      app: { algorithm },
      updateModalFromRedux,
    } = this.props;

    const currentNode = algorithm.nodes[questionId];
    updateModalFromRedux({ node: currentNode }, modalType.description);
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

        <View style={styles.additionalDrugWrapper}>
          <Text tyle={styles.additionalDrugTitle} customTitle>
            {t('diagnoses:additional_drugs')}
          </Text>
          <Text style={styles.additionalDrugSubtitle} italic>
            {t('diagnoses:duration_in_days')}
          </Text>
        </View>

        {Object.keys(diagnoses.additionalDrugs).length > 0 ? (
          Object.keys(diagnoses.additionalDrugs).map((additionalKey) => (
            <View key={`drug-${additionalKey}`} style={styles.drugContainer}>
              <View style={styles.additionalDrugName}>
                <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(algorithm.nodes[additionalKey].id)}>
                  <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                </TouchableOpacity>
                <Text key={`drug-${additionalKey}`}>{algorithm.nodes[additionalKey].label}</Text>
              </View>
              <TextInput
                style={styles.durationInput}
                keyboardType="decimal-pad"
                value={diagnoses.additionalDrugs[additionalKey].duration}
                onChange={(val) => this._changeCustomDuration(val.nativeEvent.text, additionalKey)}
                maxLength={2}
              />
            </View>
          ))
        ) : (
          <Text italic>{t('diagnoses:no_additional_drugs')}</Text>
        )}

        <Text customTitle>{t('diagnoses:add_drugs')}</Text>

        <MultiSelect
          hideTags
          items={drugsList}
          uniqueKey="id"
          onSelectedItemsChange={(item) => this.onSelectedItemsChange(item, 'drug')}
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
          flatListProps={{ maxHeight: 200, nestedScrollEnabled: true }}
        />

        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:additional_managements')}
        </Text>
        {Object.keys(diagnoses.additionalManagements).length > 0 ? (
          Object.keys(diagnoses.additionalManagements).map((additionalKey) => (
            <View key={`additional-${additionalKey}`} style={styles.container}>
              <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(algorithm.nodes[additionalKey].id)}>
                <Icon type="AntDesign" name="info" style={styles.iconInfo} />
              </TouchableOpacity>
              <Text key={`additional-${additionalKey}`}>{algorithm.nodes[additionalKey].label}</Text>
            </View>
          ))
        ) : (
          <Text italic>{t('diagnoses:no_additional_managements')}</Text>
        )}

        <Text customTitle>{t('diagnoses:add_managements')}</Text>

        <MultiSelect
          hideTags
          items={managementsList}
          uniqueKey="id"
          onSelectedItemsChange={(item) => this.onSelectedItemsChange(item, 'management')}
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
          flatListProps={{ maxHeight: 200, nestedScrollEnabled: true }}
        />
      </View>
    );
  }
}
