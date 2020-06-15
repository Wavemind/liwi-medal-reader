// @flow
import React, { Component } from 'react';
import { Icon, Text, View, Card, CardItem, Body } from 'native-base';
import { TextInput } from 'react-native';

import { NavigationScreenProps } from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import { liwiColors } from '../../../../utils/constants';
import Medicine from '../../../../components/Medicine';
import { categories } from '../../../../../frontend_service/constants';
import CustomMedicine from '../../../../components/CustomMedicine';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
import { styles } from './Medicines.style';
import { LiwiTitle2 } from '../../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};

export default class Medicines extends Component<Props, State> {
  state = {};

  static defaultProps = {};

  shouldComponentUpdate(nextProps) {
    const { pageIndex } = this.props;
    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }
    return true;
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

  _medicineCards = (title, medicine, key) => {
    const {
      app: { t },
      medicalCase: { nodes },
    } = this.props;

    return (
      <Card>
        <CardItem style={styles.cardItemCondensed}>
          <View style={styles.cardTitleContent}>
            <Text customSubTitle style={styles.cardTitle}>
              {medicine.label}
            </Text>
            <LiwiTitle2 noBorder style={styles.noRightMargin}>
              <Text note>{title}</Text>
            </LiwiTitle2>
          </View>
        </CardItem>
        <CardItem style={styles.cardItemCondensed}>
          <Body>
            {Object.keys(medicine.drugs).map((treatmentId) => {
              if (calculateCondition(medicine.drugs[treatmentId]) === true) {
                return <Medicine type="proposed" key={`${treatmentId}_medicine`} medicine={medicine.drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
              }
              return (
                <Text key={`${key}diagnoses`} italic>
                  {t('diagnoses:no_drugs')}
                </Text>
              );
            })}
          </Body>
        </CardItem>
      </Card>
    );
  };

  render() {
    const {
      medicalCase: { diagnoses, nodes },
      app: { t },
    } = this.props;

    const allDrugs = nodes.filterByCategory(categories.drug);

    let filteredAllDrugs = allDrugs;
    const selected = Object.keys(diagnoses.additionalDrugs).map((s) => diagnoses.additionalDrugs[s].id);

    // Filter drugs
    Object.keys(diagnoses.proposed).forEach((key) => {
      if (diagnoses.proposed[key].agreed === true) {
        Object.keys(diagnoses.proposed[key].drugs).forEach((treatmentId) => {
          filteredAllDrugs = _.filter(filteredAllDrugs, (item) => {
            if (diagnoses.proposed[key].drugs[treatmentId].agreed === true) {
              return item.id !== Number(treatmentId);
            }
            return true;
          });
        });
      }
    });

    // filter drugs
    Object.keys(diagnoses.additional).forEach((key) => {
      Object.keys(diagnoses.additional[key].drugs).forEach((treatmentId) => {
        filteredAllDrugs = _.filter(filteredAllDrugs, (item) => {
          if (diagnoses.additional[key].drugs[treatmentId].agreed === true) {
            return item.id !== Number(treatmentId);
          }
          return true;
        });
      });
    });

    const renderMedicinesProposed = (
      <>
        {Object.keys(diagnoses.proposed).map((key) => {
          if (diagnoses.proposed[key].agreed === true) {
            let isPossible = false;

            Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
              if (calculateCondition(diagnoses.proposed[key].drugs[treatmentId]) === true) {
                isPossible = true;
              }
            });

            if (isPossible) {
              return this._medicineCards(t('diagnoses_label:proposed'), diagnoses.proposed[key], key);
            }
          } else {
            return null;
          }
        })}
      </>
    );

    const renderMedicineAdditional = Object.keys(diagnoses.additional).map((key) => {
      return this._medicineCards(t('diagnoses_label:additional'), diagnoses.additional[key], key);
    });

    const renderAdditionalDrugs = (
      <View style={styles.viewBox}>
        {Object.keys(diagnoses.additionalDrugs).map((s) => (
          <View style={styles.viewItem}>
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
                  placeholder="Write here"
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    );

    return (
      <View>
        <Text customTitle style={styles.noTopMargin}>
          {t('diagnoses:medicines')}
        </Text>
        {Object.keys(diagnoses.proposed).length > 0 ? renderMedicinesProposed : null}
        {Object.keys(diagnoses.additional).length > 0 ? renderMedicineAdditional : null}
        {Object.keys(diagnoses.proposed).length === 0 && Object.keys(diagnoses.additional).length === 0 ? <Text italic>{t('diagnoses:no_medicines')}</Text> : null}
        {Object.keys(diagnoses.custom).map((w, i) => (
          <CustomMedicine key={i} diagnose={diagnoses.custom[w]} diagnoseKey={i} />
        ))}

        {filteredAllDrugs.length > 0 && <Text customTitle>{t('diagnoses:add_medicine')}</Text>}
        {renderAdditionalDrugs}

        {filteredAllDrugs.length > 0 && (
          <MultiSelect
            hideTags
            items={filteredAllDrugs}
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
