// @flow
import React, { Component } from 'react';
import { Icon, Text, View } from 'native-base';
import { TextInput } from 'react-native';

import { NavigationScreenProps } from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import { liwiColors } from '../../../../utils/constants';
import Medecine from '../../../../components/Medicine';
import { categories } from '../../../../../frontend_service/constants';
import CustomMedecine from '../../../../components/CustomMedicine';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
import { styles } from './Medicines.style';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class Medicines extends Component<Props, State> {
  state = {};

  static defaultProps = {};

  shouldComponentUpdate(nextProps, nextState) {
    const { pageIndex } = this.props;
    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }
    return true;
  }

  onSelectedItemsChange = (selectedItems) => {
    const {
      setAdditionalMedicine,
      medicalCase: { nodes, diagnostics },
    } = this.props;

    const objMedicine = {};

    selectedItems.map((i) => {
      let duration = 0;

      // Get max duration from final_diagnostics
      Object.keys(diagnostics).map((id) => {
        Object.keys(diagnostics[id].final_diagnostics).map((id_final) => {
          if (diagnostics[id].final_diagnostics[id_final].drugs[i]?.duration > duration) {
            duration = diagnostics[id].final_diagnostics[id_final].drugs[i].duration;
          }
        });
      });

      objMedicine[i] = nodes[i];
      objMedicine[i].agreed = true;
      objMedicine[i].duration = duration;
    });

    setAdditionalMedicine(objMedicine);
  };

  _changeCustomDuration = (value, id) => {
    const reg = new RegExp(/^\d+$/);

    const { setAdditionalMedicineDuration } = this.props;
    if (reg.test(value) || value === '') {
      setAdditionalMedicineDuration(id, value);
    }
  };

  render() {
    const {
      medicalCase: { diagnoses, algorithm_name, nodes },
      app: { t },
    } = this.props;

    const allDrugs = nodes.filterByCategory(categories.drug);

    let filteredAllDrugs = allDrugs;
    const selected = Object.keys(diagnoses.additionalDrugs).map((s) => diagnoses.additionalDrugs[s].id);

    // filter drugs
    Object.keys(diagnoses.proposed).map((key) => {
      if (diagnoses.proposed[key].agreed === true) {
        Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
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
    Object.keys(diagnoses.additional).map((key) => {
      Object.keys(diagnoses.additional[key].drugs).map((treatmentId) => {
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
              return (
                <>
                  <Text key={`${key}diagnoses`} size-auto customTitle>
                    {diagnoses.proposed[key].label}
                  </Text>
                  {Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
                    if (calculateCondition(diagnoses.proposed[key].drugs[treatmentId]) === true) {
                      return <Medecine type="proposed" key={`${treatmentId}_medecine`} medecine={diagnoses.proposed[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
                    }

                    return (
                      <Text key={`${key}diagnoses`} size-auto>
                        {t('diagnoses:no_drugs')}
                      </Text>
                    );
                  })}
                </>
              );
            }
          } else {
            return null;
          }
        })}
      </>
    );
    const renderMedicineAdditional = (
      <View style={styles.viewBox}>
        {Object.keys(diagnoses.additional).map((key) => {
          return (
            <>
              <Text key={`${key}diagnoses`} size-auto customTitle>
                {diagnoses.additional[key].label} <Text>- {t('diagnoses_label:additional')}</Text>
              </Text>

              {Object.keys(diagnoses.additional[key].drugs).length > 0 ? (
                Object.keys(diagnoses.additional[key].drugs).map((treatmentId) => {
                  return <Medecine type="additional" key={`${treatmentId}_medecine`} medecine={diagnoses.additional[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
                })
              ) : (
                <Text key={`${key}diagnoses`} size-auto>
                  {t('diagnoses:no_drugs')}
                </Text>
              )}
            </>
          );
        })}
      </View>
    );
    const renderAdditionalDrugs = (
      <View style={styles.viewBox}>
        {Object.keys(diagnoses.additionalDrugs).map((s) => (
          <View style={styles.viewitem}>
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
        <Text style={styles.label}>{t('diagnoses:medicine')}</Text>
        {renderMedicinesProposed}
        {renderMedicineAdditional}
        {Object.keys(diagnoses.custom).map((w, i) => (
          <CustomMedecine diagnose={diagnoses.custom[w]} diagnoseKey={i} />
        ))}

        {filteredAllDrugs.length > 0 && <Text style={styles.label}>{t('diagnoses:add_medicine')}</Text>}
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
