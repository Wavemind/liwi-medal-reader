// @flow
import React, { Component } from 'react';
import { Icon, Picker, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { administrationRouteCategories, medicationForms } from '../../../../../frontend_service/constants';
import { styles } from './MedicinesFormulation.style';
import { DrugModel } from '../../../../../frontend_service/engine/models/Drug.model';

type Props = NavigationScreenProps & {};
type State = {};

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

  /**
   * Display measurement unit
   * @param type
   * @returns {string}
   */
  displayMedicationForm = (type) => {
    switch (type) {
      case medicationForms.syrup:
      case medicationForms.suspension:
      case medicationForms.powder_for_injection:
      case medicationForms.solution:
        return 'ml';
      case medicationForms.tablet:
      case medicationForms.capsule:
        return 'mg';
      default:
        return ' dose';
    }
  };

  /**
   * Formulation display
   * @param instance
   * @param selected
   * @param onSelect
   * @returns {JSX.Element}
   * @private
   */
  _renderFormulation = (instance, selected, onSelect) => {
    const {
      medicalCase: { nodes },
      app: { t },
    } = this.props;

    return (
      <View style={styles.blocDrug} key={instance.id}>
        <View style={styles.flex}>
          <Text size-auto>{nodes[instance.id]?.label}</Text>
          <Text italic>{instance.diagnoses.map((e, i) => (e !== null ? `${nodes[e.id].label} ${instance.diagnoses.length - 1 === i ? '' : '/'} ` : t('diagnoses:none')))}</Text>
        </View>
        <View style={styles.select}>
          <Icon name="arrow-drop-down" type="MaterialIcons" style={styles.pickerIcon} />
          <Picker note mode="dropdown" style={styles.pickerContent} selectedValue={selected} onValueChange={onSelect}>
            <Picker.Item label={t('application:select')} value={null} />
            {nodes[instance.id]?.formulations.map((f, index) => {
              const preCalculed = nodes[instance.id].getDrugDoses(index);
              let string = '';
              let isPossible = true;
              if (preCalculed.doseResult !== null) {
                switch (preCalculed.medication_form) {
                  case medicationForms.syrup:
                  case medicationForms.suspension:
                  case medicationForms.powder_for_injection:
                  case medicationForms.solution:
                    string = preCalculed.doseResult;
                    break;
                  case medicationForms.capsule:
                  case medicationForms.tablet:
                    string = (preCalculed.doseResult * preCalculed.dose_form) / preCalculed.breakable;
                    break;
                }
              }

              if (preCalculed.unique_dose !== null) {
                string = preCalculed.unique_dose;
              }

              if (preCalculed.no_possibility !== undefined) {
                string = preCalculed.no_possibility;
                isPossible = false;
              }

              // Only one option so pre-select it if possible
              if (nodes[instance.id]?.formulations.length === 1 && isPossible && index !== selected) {
                onSelect(index);
              }

              return (
                <Picker.Item
                  key={f}
                  label={`${t(`medication_form:${f.medication_form}`)}: ${string} ${isPossible ? this.displayMedicationForm(f.medication_form) : ''}`}
                  value={isPossible ? index : false}
                />
              );
            })}
          </Picker>
        </View>
      </View>
    );
  };

  render() {
    const {
      medicalCase: { nodes },
      app: { t },
    } = this.props;

    const drugs = DrugModel.getAgreed();

    const generateFormulation = () =>
      Object.keys(drugs).map((formulation) => {
        const { formulationSelected } = drugs[formulation];
        const selected = formulationSelected === undefined ? null : formulationSelected;
        const onSelect = (value) => this.onValueChange(value, drugs[formulation], formulation);

        return (
          <>
            {this._renderFormulation(drugs[formulation], selected, onSelect)}
            {selected !== null && administrationRouteCategories.includes(nodes[formulation].formulations[selected].administration_route_category) ? (
              <Text>{nodes[formulation].formulations[formulationSelected].injection_instructions}</Text>
            ) : null}
          </>
        );
      });

    return (
      <View style={styles.container}>
        {Object.keys(drugs).length > 0 && <Text customTitle>{t('diagnoses:which')}</Text>}
        {generateFormulation()}
      </View>
    );
  }
}
