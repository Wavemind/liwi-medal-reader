// @flow
import React, { Component } from 'react';
import { Icon, Picker, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { healthCareType } from '../../../../../frontend_service/constants';
import { getDrugs } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
import { styles } from './MedicinesFormulation.style';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class MedicinesFormulations extends Component<Props, State> {
  onValueChange = (value, node, drugId) => {
    const { setFormulation } = this.props;
    if (value !== false) {
      node.diagnoses.map((diagnose) => {
        if (diagnose !== null) {
          setFormulation(diagnose.id, value, diagnose.type, drugId);
        } else {
          setFormulation(null, value, 'additionalDrugs', drugId);
        }
      });
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

  _renderDrug = (instance, selected, onSelect) => {
    const {
      medicalCase: { nodes },
      app: { t },
    } = this.props;

    return (
      <View style={styles.blocDrug}>
        <View style={styles.flex}>
          <Text size-auto>{nodes[instance.id]?.label}</Text>
          <Text italic>{instance.diagnoses.map((e, i) => (e !== null ? `${nodes[e.id].label} ${instance.diagnoses.length - 1 === i ? '' : '/'} ` : t('diagnoses:none')))}</Text>
        </View>
        <View style={styles.select}>
          <Icon name="arrow-drop-down" type="MaterialIcons" style={styles.pickerIcon} />
          <Picker note mode="dropdown" style={styles.pickerContent} selectedValue={selected} onValueChange={onSelect}>
            <Picker.Item label="Please select" value={null} />
            {nodes[instance.id]?.formulations.map((f) => {
              const preCalculed = nodes[instance.id].getDrugDoses(f.medication_form);
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

              // Only one option so pre-select it if possible
              if (nodes[instance.id]?.formulations.length === 1 && isPossible && f.medication_form !== selected) {
                onSelect(f.medication_form);
              }

              return <Picker.Item key={f} label={`${f.medication_form}: ${string} ${isPossible ? this.showSize(f.medication_form) : ''}`} value={isPossible ? f.medication_form : false} />;
            })}
          </Picker>
        </View>
      </View>
    );
  };

  render() {
    const {
      medicalCase: {
        diagnoses: { proposed },
      },
      app: { t },
    } = this.props;

    let isProposed = false;

    Object.keys(proposed).forEach((q) => {
      Object.keys(proposed[q].drugs).forEach((f) => {
        if (proposed[q].drugs[f].agreed === true && calculateCondition(proposed[q].drugs[f]) === true) {
          isProposed = true;
        }
      });
    });

    const formulations = getDrugs();

    const generateFormulation = () =>
      Object.keys(formulations).map((fm) => {
        const selected = formulations[fm].formulationSelected === undefined ? null : formulations[fm].formulationSelected;
        const onSelect = (value) => this.onValueChange(value, formulations[fm], fm);
        return this._renderDrug(formulations[fm], selected, onSelect);
      });

    return (
      <View style={styles.container}>
        {Object.keys(formulations).length > 0 && <Text customTitle>{t('diagnoses:which')}</Text>}
        {generateFormulation()}
      </View>
    );
  }
}
