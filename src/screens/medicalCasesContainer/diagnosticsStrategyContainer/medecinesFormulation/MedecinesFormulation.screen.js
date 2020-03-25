// @flow
import React, { Component } from 'react';
import { Content, Text, View, Picker, Button, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { healthCareType } from '../../../../../frontend_service/constants';
import { titleMannualyDiagnoses } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class MedecinesFormulations extends Component<Props, State> {
  state = { selected: '' };

  onValueChange = (value, diagnoseId, type, drugId) => {
    const { setFormulation } = this.props;
    if (value !== false) {
      setFormulation(diagnoseId, value, type, drugId);
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { pageIndex } = this.props;

    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }
    return true;
  }

  static defaultProps = {};

  showSize = (type) => {
    switch (type) {
      case healthCareType.syrup:
      case healthCareType.suspension:
        return 'ml';
      case healthCareType.tablet:
      case healthCareType.capsule:
        return 'mg';
      default:
        return ' dose';
    }
  };

  _renderDrug = (id, selected, onSelect) => {
    const {
      medicalCase: { nodes },
    } = this.props;
    return (
      <>
        <Text>{nodes[id]?.label}</Text>
        <Picker note mode="dropdown" style={{ width: 200 }} selectedValue={selected} onValueChange={onSelect}>
          <Picker.Item label="Please select" value={null} />
          {nodes[id]?.formulations.map((f) => {
            const preCalculed = nodes[id].getDrugDoses(f.medication_form);
            let string = '';
            let isPossible = true;
            if (preCalculed.doseResult !== null) {
              string = preCalculed.doseResult;
            }

            if (preCalculed.unique_dose !== null) {
              string = preCalculed.unique_dose;
            }

            if (preCalculed.no_possibility !== undefined) {
              string = preCalculed.no_possibility;
              isPossible = false;
            }

            return <Picker.Item label={`${f.medication_form} : ${string} ${isPossible ? this.showSize(f.medication_form) : ''}`} value={isPossible ? f.medication_form : false} />;
          })}
        </Picker>
      </>
    );
  };

  _renderFormulation = (data, type) => {
    return Object.keys(data).map((diagnoseId) => {
      if (data[diagnoseId].agreed === false) {
        return null;
      }

      return Object.keys(data[diagnoseId].drugs).map((drugId) => {
        const { id } = data[diagnoseId].drugs[drugId];

        if (data[diagnoseId].drugs[drugId].agreed === true && calculateCondition(data[diagnoseId].drugs[drugId]) === true) {
          const selected = data[diagnoseId]?.drugs[drugId]?.formulationSelected;
          const onSelect = (value) => this.onValueChange(value, diagnoseId, type, drugId);
          return this._renderDrug(id, selected, onSelect);
        }
        return null;
      });
    });
  };

  render() {
    const {
      medicalCase: {
        diagnoses: { proposed, additional, additionalDrugs },
      },
    } = this.props;

    let isProposed = false;

    Object.keys(proposed).map((q) => {
      Object.keys(proposed[q].drugs).map((f) => {
        if (proposed[q].drugs[f].agreed === true && calculateCondition(proposed[q].drugs[f]) === true) {
          isProposed = true;
        }
      });
    });

    return (
      <View>
        {isProposed && <Text customTitle>Which formulation of medicine is available and appropriate for your patient?</Text>}
        {this._renderFormulation(proposed, 'proposed')}
        {titleMannualyDiagnoses() && <Text customTitle> Manually added medicine from dropdown list</Text>}
        {this._renderFormulation(additional, 'additional')}
        {Object.keys(additionalDrugs).length > 0 && <Text customTitle> Additional drug not related to diagnostic</Text>}
        {Object.keys(additionalDrugs).map((y) => {
          const selected = additionalDrugs[y]?.formulationSelected;
          const onSelect = (value) => this.onValueChange(value, null, 'additionalDrugs', y);
          return this._renderDrug(y, selected, onSelect);
        })}
      </View>
    );
  }
}
