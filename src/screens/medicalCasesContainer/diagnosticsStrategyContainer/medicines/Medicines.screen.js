// @flow
import React, { Component } from 'react';
import { Icon, Text, View } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';

import CustomMedicine from '../../../../components/CustomMedicine';
import { liwiColors } from '../../../../utils/constants';
import { styles } from './Medicines.style';
import MedicineSelection from '../../../../components/MedicineSelection';
import { healthCares } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import { finalDiagnosticCalculateCondition } from '../../../../../frontend_service/helpers/FinalDiagnostic.model';

export default class Medicines extends Component {
  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 2;
  }

  /**
   * Set additional medicine in medical case
   * @param {Array} selectedItems - List of all additional item selected
   */
  onSelectedItemsChange = (selectedItems) => {
    const {
      setAdditionalMedicine,
      medicalCase: { nodes },
      app: {
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

    setAdditionalMedicine(objMedicine);
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

  render() {
    const {
      medicalCase,
      medicalCase: { diagnoses },
      app: { t, algorithm },
    } = this.props;

    const allHealthCares = healthCares(algorithm);
    let filteredHealthCares = allHealthCares;

    const selected = Object.keys(diagnoses.additionalDrugs).map((s) => diagnoses.additionalDrugs[s].id);

    // Filter drugs proposed
    Object.keys(diagnoses.proposed).forEach((key) => {
      if (diagnoses.proposed[key].agreed === true) {
        Object.keys(diagnoses.proposed[key].drugs).forEach((treatmentId) => {
          filteredHealthCares = _.filter(filteredHealthCares, (item) => {
            if (diagnoses.proposed[key].drugs[treatmentId].agreed === true) {
              return item.id !== Number(treatmentId);
            }
            return true;
          });
        });
      }
    });

    // Filter drugs additional
    Object.keys(diagnoses.additional).forEach((key) => {
      Object.keys(diagnoses.additional[key].drugs).forEach((treatmentId) => {
        filteredHealthCares = _.filter(filteredHealthCares, (item) => {
          if (diagnoses.additional[key].drugs[treatmentId].agreed === true) {
            return item.id !== Number(treatmentId);
          }
          return true;
        });
      });
    });

    return (
      <View>
        <Text customTitle style={styles.noTopMargin}>
          {t('diagnoses:medicines')}
        </Text>
        {Object.keys(diagnoses.proposed).length === 0 && Object.keys(diagnoses.additional).length === 0 ? (
          <Text italic>{t('diagnoses:no_medicines')}</Text>
        ) : (
          <>
            {Object.keys(diagnoses.proposed).map((key) => {
              if (diagnoses.proposed[key].agreed === true && finalDiagnosticCalculateCondition(algorithm, medicalCase, medicalCase.nodes[key])) {
                return (
                  <MedicineSelection key={`proposed_medicine_${key}`} algorithm={algorithm} diagnosesFinalDiagnostic={diagnoses.proposed[key]} diagnoseKey="proposed" t={t} medicalCase={medicalCase} />
                );
              }
            })}
            {Object.keys(diagnoses.additional).map((key) => (
              <MedicineSelection
                key={`additional_medicine_${key}`}
                algorithm={algorithm}
                diagnosesFinalDiagnostic={diagnoses.additional[key]}
                diagnoseKey="additional"
                t={t}
                medicalCase={medicalCase}
              />
            ))}
          </>
        )}
        {Object.keys(diagnoses.custom).map((w, i) => (
          <CustomMedicine key={i} diagnose={diagnoses.custom[w]} diagnoseKey={i} />
        ))}

        {filteredHealthCares.length > 0 && (
          <View style={styles.additionalDrugWrapper}>
            <Text tyle={styles.additionalDrugTitle} customTitle>
              {t('diagnoses:add_medicine')}
            </Text>
            <Text style={styles.additionalDrugSubtitle} italic>
              {t('diagnoses:duration_in_days')}
            </Text>
          </View>
        )}
        <View style={styles.viewBox}>
          {Object.keys(diagnoses.additionalDrugs).map((drugId) => (
            <View key={`drug-${drugId}`} style={styles.container}>
              <View style={styles.additionalDrugName}>
                <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(algorithm.nodes[drugId].id)}>
                  <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                </TouchableOpacity>
                <Text key={`drug-${drugId}`}>{algorithm.nodes[drugId].label}</Text>
              </View>
              <TextInput
                style={styles.durationInput}
                keyboardType="decimal-pad"
                value={diagnoses.additionalDrugs[drugId].duration}
                onChange={(val) => this._changeCustomDuration(val.nativeEvent.text, drugId)}
                maxLength={2}
              />
            </View>
          ))}
        </View>

        {filteredHealthCares.length > 0 && (
          <MultiSelect
            hideTags
            items={filteredHealthCares}
            uniqueKey="id"
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={selected}
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
        )}
      </View>
    );
  }
}
