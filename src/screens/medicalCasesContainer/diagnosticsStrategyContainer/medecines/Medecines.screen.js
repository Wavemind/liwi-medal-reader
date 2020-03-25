// @flow
import React, { Component } from 'react';
import { Input, Text, View } from 'native-base';
import { TextInput } from 'react-native';

import { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import Medecine from '../../../../components/Medecine';
import { categories } from '../../../../../frontend_service/constants';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import CustomMedecine from '../../../../components/CustomMedecine';
import { calculateCondition, returnConditionsArray } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
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

      // Get max duration
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
    var reg = new RegExp(/^\d+$/);

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

    Object.keys(diagnoses.proposed).map((q) => {
      Object.keys(diagnoses.proposed[q].drugs).map((treatmentId) => {
        if (diagnoses.proposed[q].agreed === true && calculateCondition(diagnoses.proposed[q].drugs[treatmentId]) === true) {
          isProposed = true;
        }
      });
    });

    return (
      <View>
        {isProposed && <Text customTitle>Medicines proposed by "{name}"</Text>}
        {Object.keys(diagnoses.proposed).map((key) => {
          if (diagnoses.proposed[key].agreed === true) {
            let isPossible = false;

            Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
              isPossible = calculateCondition(diagnoses.proposed[key].drugs[treatmentId]);
            });

            if (true) {
              return (
                <>
                  <Text key={`${key}diagnoses`} size-auto style={styles.label}>
                    {diagnoses.proposed[key].label}
                  </Text>
                  {Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
                    if (calculateCondition(diagnoses.proposed[key].drugs[treatmentId]) === true) {
                      return <Medecine type={'proposed'} key={`${treatmentId}_medecine`} medecine={diagnoses.proposed[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
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
        {isManually && <Text customTitle>Manually added Medicines</Text>}
        {Object.keys(diagnoses.additional).map((key) => {
          return (
            <>
              <Text key={`${key}diagnoses`} size-auto style={{ backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, padding: 4, borderRadius: 2, paddingLeft: 20, marginBottom: 20 }}>
                {diagnoses.additional[key].label}
              </Text>
              {Object.keys(diagnoses.additional[key].drugs).map((treatmentId) => {
                return <Medecine type={'additional'} key={`${treatmentId}_medecine`} medecine={diagnoses.additional[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
              })}
            </>
          );
        })}

        {filteredAllDrugs.length > 0 && <Text customTitle>Additionnal Medicines</Text>}

        <View style={{ marginBottom: 20 }}>
          {Object.keys(diagnoses.additionalDrugs).map((s) => (
            <>
              <Text size-auto>
                - {diagnoses.additionalDrugs[s].label}, medicine duration : {diagnoses.additionalDrugs[s].duration}
              </Text>
              <TextInput
                keyboardType={'numeric'}
                value={diagnoses.additionalDrugs[s].duration}
                onChange={(val) => this._changeCustomDuration(val.nativeEvent.text, s)}
                maxLength={3}
                placeholder={'Custom medicine duration'}
              />
            </>
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
            searchInputStyle={{ color: '#CCC' }}
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
