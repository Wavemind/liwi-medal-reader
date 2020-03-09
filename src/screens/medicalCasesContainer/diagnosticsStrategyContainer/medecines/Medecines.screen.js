// @flow
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import Medecine from '../../../../components/Medecine';
import { categories } from '../../../../../frontend_service/constants';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import { SeparatorLine } from '../../../../template/layout';
import CustomMedecine from '../../../../components/CustomMedecine';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class Medecines extends Component<Props, State> {
  state = {};

  static defaultProps = {};

  onSelectedItemsChange = (selectedItems) => {
    const {
      setAdditionalMedecine,
      medicalCase: { nodes },
    } = this.props;

    const objMedecine = {};
    selectedItems.map((i) => {
      objMedecine[i] = nodes[i];
    });

    setAdditionalMedecine(objMedecine);
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
            return item.id !== Number(treatmentId);
          });
        });
      }
    });

    Object.keys(diagnoses.additional).map((key) => {
      Object.keys(diagnoses.additional[key].drugs).map((treatmentId) => {
        filteredAllDrugs = _.filter(filteredAllDrugs, (item) => {
          return item.id !== Number(treatmentId);
        });
      });
    });

    return (
      <View>
        <Text customTitle>Medecines proposed by {name}</Text>
        {Object.keys(diagnoses.proposed).map((key) => {
          if (diagnoses.proposed[key].agreed === true) {
            return (
              <>
                <Text key={`${key}diagnoses`} size-auto style={{ backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, padding: 4, borderRadius: 2, paddingLeft: 20 }}>
                  {diagnoses.proposed[key].label}
                </Text>
                {Object.keys(diagnoses.proposed[key].drugs).map((treatmentId) => {
                  return <Medecine type={'proposed'} key={`${treatmentId}_medecine`} medecine={diagnoses.proposed[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
                })}
              </>
            );
          } else {
            return null;
          }
        })}
        {Object.keys(diagnoses.additional).length > 0 && <Text customTitle>Mannualy added Medecines</Text>}
        {Object.keys(diagnoses.additional).map((key) => {
          return (
            <>
              <Text key={`${key}diagnoses`} size-auto style={{ backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, padding: 4, borderRadius: 2, paddingLeft: 20 }}>
                {diagnoses.additional[key].label}
              </Text>
              {Object.keys(diagnoses.additional[key].drugs).map((treatmentId) => {
                return <Medecine type={'additional'} key={`${treatmentId}_medecine`} medecine={diagnoses.additional[key].drugs[treatmentId]} diagnosesKey={key} node={nodes[treatmentId]} />;
              })}
            </>
          );
        })}

        {filteredAllDrugs.length > 0 && <Text customTitle>Additionnal Medecines</Text>}

        <View style={{ marginBottom: 20 }}>
          {Object.keys(diagnoses.additionalDrugs).map((s) => (
            <Text size-auto>- {diagnoses.additionalDrugs[s].label}</Text>
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
