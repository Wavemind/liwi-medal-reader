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
import { modalType } from '../../../../../frontend_service/constants';
import { translateText } from '../../../../utils/i18n';

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
      app: { t, algorithm, algorithmLanguage },
    } = this.props;

    const allHealthCares = healthCares(algorithm);
    let filteredHealthCares = allHealthCares;

    const selected = Object.keys(diagnoses.additionalDrugs).map((s) => diagnoses.additionalDrugs[s].id);

    // Filter drugs proposed
    Object.keys(diagnoses.proposed).forEach((key) => {
      if (diagnoses.proposed[key].agreed === true) {
        Object.keys(diagnoses.proposed[key].drugs).forEach((treatmentId) => {
          filteredHealthCares = _.filter(filteredHealthCares, (item) => {
            item.label_translated = translateText(item.label, algorithmLanguage);
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
          item.label_translated = translateText(item.label, algorithmLanguage);
          if (diagnoses.additional[key].drugs[treatmentId].agreed === true) {
            return item.id !== Number(treatmentId);
          }
          return true;
        });
      });
    });

    // Order by priority
    const proposed = _.orderBy(Object.values(diagnoses.proposed), (finalDiagnostic) => algorithm.nodes[finalDiagnostic.id].level_of_urgency, ['desc', 'asc']);
    const additional = _.orderBy(Object.values(diagnoses.additional), (finalDiagnostic) => algorithm.nodes[finalDiagnostic.id].level_of_urgency, ['desc', 'asc']);

    return (
      <View>
        <Text customTitle style={styles.noTopMargin}>
          {t('diagnoses:medicines')}
        </Text>
        <View style={styles.warningBloc}>
          <Text white>{t('diagnoses:medicine_mandatory')}</Text>
        </View>
        {Object.keys(diagnoses.proposed).length === 0 && Object.keys(diagnoses.additional).length === 0 ? (
          <Text italic>{t('diagnoses:no_medicines')}</Text>
        ) : (
          <>
            {proposed.map((finalDiagnostic) => {
              if (finalDiagnostic.agreed === true && finalDiagnosticCalculateCondition(algorithm, medicalCase, medicalCase.nodes[finalDiagnostic.id])) {
                return (
                  <MedicineSelection key={`proposed_medicine_${finalDiagnostic.id}`} algorithm={algorithm} diagnosesFinalDiagnostic={finalDiagnostic} diagnoseKey="proposed" t={t} medicalCase={medicalCase} algorithmLanguage={algorithmLanguage} />
                );
              }
            })}
            {additional.map((finalDiagnostic) => (
              <MedicineSelection
                key={`additional_medicine_${finalDiagnostic.id}`}
                algorithm={algorithm}
                diagnosesFinalDiagnostic={diagnoses.additional[finalDiagnostic.id]}
                diagnoseKey="additional"
                t={t}
                medicalCase={medicalCase}
                algorithmLanguage={algorithmLanguage}
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
                <Text key={`drug-${drugId}`}>{translateText(algorithm.nodes[drugId].label, algorithmLanguage)}</Text>
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
            displayKey="label_translated"
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
