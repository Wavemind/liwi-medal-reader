// @flow
import React, { Component } from 'react';
import { Icon, Text, View } from 'native-base';
import { TextInput } from 'react-native';

import { NavigationScreenProps } from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import { liwiColors } from '../../../../utils/constants';
import Medecine from '../../../../components/Medecine';
import { categories } from '../../../../../frontend_service/constants';
import CustomMedecine from '../../../../components/CustomMedecine';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
import { styles } from './Medecines.style';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class Medecines extends Component<Props, State> {
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
      setAdditionalMedecine,
      medicalCase: { nodes, diagnostics },
    } = this.props;

    const objMedecine = {};

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

      objMedecine[i] = nodes[i];
      objMedecine[i].agreed = true;
      objMedecine[i].duration = duration;
    });

    setAdditionalMedecine(objMedecine);
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
      medicalCase: { diagnoses, name, nodes },
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

    let isProposed = false;
    const isManually = Object.keys(diagnoses.additional).length > 0;

    // can be proposed
    Object.keys(diagnoses.proposed).map((q) => {
      Object.keys(diagnoses.proposed[q].drugs).map((treatmentId) => {
        if (diagnoses.proposed[q].agreed === true && calculateCondition(diagnoses.proposed[q].drugs[treatmentId]) === true) {
          isProposed = true;
        }
      });
    });

    const renderAdditional = (
      <>
        {Object.keys(diagnoses.additional).map((key) => {
          return (
            <>
              <Text
                key={`${key}diagnoses`}
                size-auto
                style={{
                  backgroundColor: liwiColors.redColor,
                  color: liwiColors.whiteColor,
                  padding: 4,
                  borderRadius: 2,
                  paddingLeft: 20,
                  marginBottom: 20,
                }}
              >
                {diagnoses.additional[key].label}
              </Text>
              {Object.keys(diagnoses.additional[key].drugs).map((treatmentId) => {
                return <Medecine type="additional" key={`${treatmentId}_medecine`} medecine={diagnoses.additional[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
              })}
            </>
          );
        })}
      </>
    );

    const renderProposed = (
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
                  <Text key={`${key}diagnoses`} size-auto style={styles.label}>
                    {diagnoses.proposed[key].label}
                  </Text>
                  {Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
                    if (calculateCondition(diagnoses.proposed[key].drugs[treatmentId]) === true) {
                      return <Medecine type="proposed" key={`${treatmentId}_medecine`} medecine={diagnoses.proposed[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
                    }
                    return null;
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

    return (
      <View>
        {isProposed && <Text customTitle>Medicines proposed by "{name}"</Text>}
        {renderProposed}
        {isManually && <Text customTitle>Manually added Medicines</Text>}
        {renderAdditional}

        {filteredAllDrugs.length > 0 && <Text customTitle>Additionnal Medicines</Text>}

        <View style={styles.viewBox}>
          {Object.keys(diagnoses.additionalDrugs).map((s) => (
            <View style={styles.viewitem}>
              <View style={styles.flex50}>
                <Text size-auto>{diagnoses.additionalDrugs[s].label}</Text>
                <Text italic>Duration : {diagnoses.additionalDrugs[s].duration} days</Text>
              </View>
              <View style={styles.flex50}>
                <Text>Custom duration :</Text>
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
        {Object.keys(diagnoses.custom).length > 0 && <Text customTitle>Another diagnoses not proposed</Text>}
        {Object.keys(diagnoses.custom).map((w, i) => (
          <CustomMedecine diagnose={diagnoses.custom[w]} diagnoseKey={i} />
        ))}
      </View>
    );
  }
}
