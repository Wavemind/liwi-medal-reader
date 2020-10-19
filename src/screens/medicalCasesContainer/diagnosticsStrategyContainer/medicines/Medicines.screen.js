// @flow
import React, { Component } from 'react';
import { Icon, Text, View } from 'native-base';
import { TextInput } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';

import CustomMedicine from '../../../../components/CustomMedicine';
import { liwiColors } from '../../../../utils/constants';
import { styles } from './Medicines.style';
import MedicineSelection from '../../../../components/MedicineSelection';
import { questionsHealthCares } from '../../../../../frontend_service/algorithm/questionsStage.algo';
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
      medicalCase: { nodes, diagnostics },
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

    const allHealthCares = questionsHealthCares(algorithm);
    console.log(allHealthCares)
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

        Object.keys(diagnoses.proposed[key].managements).forEach((managementId) => {
          filteredHealthCares = _.filter(filteredHealthCares, (item) => {
            if (diagnoses.proposed[key].managements[managementId].agreed === true) {
              return item.id !== Number(managementId);
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

      Object.keys(diagnoses.additional[key].managements).forEach((managementId) => {
        filteredHealthCares = _.filter(filteredHealthCares, (item) => {
          if (diagnoses.additional[key].drugs[managementId].agreed === true) {
            return item.id !== Number(managementId);
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

        {filteredHealthCares.length > 0 && <Text customTitle>{t('diagnoses:add_medicine')}</Text>}
        <View style={styles.viewBox}>
          {Object.keys(diagnoses.additionalDrugs).map((s) => (
            <View style={styles.viewItem} key={s}>
              <View style={styles.flex50}>
                <Text size-auto>{diagnoses.additionalDrugs[s].label}</Text>
                <Text italic>
                  {t('diagnoses:duration')}: {diagnoses.additionalDrugs[s].duration} {t('drug:days')}
                </Text>
              </View>
              <View style={styles.flex50}>
                <Text> {t('diagnoses:custom_duration')}:</Text>
                <View style={styles.box}>
                  <Icon style={styles.icon} type="Feather" name="clock" size={18} color="#000" />
                  <TextInput
                    style={styles.text}
                    keyboardType="numeric"
                    value={diagnoses.additionalDrugs[s].duration}
                    onChange={(val) => this._changeCustomDuration(val.nativeEvent.text, s)}
                    maxLength={2}
                    placeholder="..."
                  />
                </View>
              </View>
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
          />
        )}
      </View>
    );
  }
}
