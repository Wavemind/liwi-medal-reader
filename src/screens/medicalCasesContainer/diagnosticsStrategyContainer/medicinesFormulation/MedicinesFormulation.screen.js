// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Icon, Picker, Text, View } from 'native-base';
import { administrationRouteCategories, medicationForms } from '../../../../../frontend_service/constants';
import { styles } from './MedicinesFormulation.style';
import { drugAgreed, drugDoses } from '../../../../../frontend_service/helpers/Drug.model';

export default class MedicinesFormulations extends Component {
  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 3;
  }

  onValueChange = (value, node, drugId) => {
    const { setFormulationSelected } = this.props;

    if (value !== false) {
      node.diagnoses.forEach((diagnose) => {
        if (diagnose !== null) {
          setFormulationSelected(diagnose.id, value, diagnose.type, drugId);
        } else {
          setFormulationSelected(null, value, 'additionalDrugs', drugId);
        }
      });
    }
  };

  /**
   * Formulation display
   * @param formulation
   * @returns {string}
   */
  formulationLabel = (formulation) => {
    const {
      app: { t },
    } = this.props;

    switch (formulation.medication_form) {
      case medicationForms.tablet:
      case medicationForms.capsule: {
        if (formulation.by_age) {
          return `${formulation.description}: ${parseInt(formulation.unique_dose)} ${t('drug:tablets')}`;
        }
        return `${parseInt(formulation.dose_form)}mg ${formulation.medication_form}: ${formulation.doseResult !== null ? `${formulation.doseResult} ${t('drug:tablets')}` : t('drug:no_options')}`;
      }
      case medicationForms.syrup:
      case medicationForms.suspension:
      case medicationForms.powder_for_injection:
      case medicationForms.solution: {
        if (formulation.by_age) {
          return `${formulation.description}: ${parseInt(formulation.unique_dose)}ml`;
        }
        return `${parseInt(formulation.liquid_concentration)}/${parseInt(formulation.dose_form)}mg ${formulation.medication_form}: ${formulation.doseResult}ml ${t(
          'medication_form:per_administration'
        )}`;
      }
      default: {
        return t('drug:medication_form_not_exist');
      }
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
      app: { t, algorithm },
    } = this.props;

    return (
      <View style={styles.blocDrug} key={instance.id}>
        <View style={styles.flex}>
          <Text size-auto>{algorithm.nodes[instance.id]?.label}</Text>
          <Text italic>{instance.diagnoses.map((e, i) => (e !== null ? `${algorithm.nodes[e.id].label} ${instance.diagnoses.length - 1 === i ? '' : '/'} ` : t('diagnoses:none')))}</Text>
        </View>
        <View style={styles.select}>
          <Icon name="arrow-drop-down" type="MaterialIcons" style={styles.pickerIcon} />
          <Picker note mode="dropdown" style={styles.pickerContent} selectedValue={selected} onValueChange={onSelect}>
            <Picker.Item label={t('application:select')} value={null} />
            {algorithm.nodes[instance.id]?.formulations.map((f, index) => {
              const preCalculed = drugDoses(index, algorithm, instance.id);
              let isPossible = true;

              if (preCalculed.no_possibility !== undefined) {
                isPossible = false;
              }

              // Only one option so pre-select it if possible
              if (algorithm.nodes[instance.id]?.formulations.length === 1 && isPossible && index !== selected) {
                onSelect(index);
              }

              return <Picker.Item key={preCalculed} label={this.formulationLabel(preCalculed)} value={isPossible ? index : false} />;
            })}
          </Picker>
        </View>
      </View>
    );
  };

  render() {
    const {
      app: { t, algorithm },
    } = this.props;

    const drugs = drugAgreed(null, algorithm);

    return (
      <ScrollView>
        {Object.keys(drugs).length > 0 && <Text customTitle>{t('diagnoses:which')}</Text>}
        {Object.keys(drugs).map((drugId) => {
          const currentDrug = algorithm.nodes[drugId];
          const drug = drugs[drugId];

          const selected = drug.formulationSelected === undefined ? null : drug.formulationSelected;
          const onSelect = (value) => this.onValueChange(value, drugs[drugId], drugId);

          return (
            <>
              {this._renderFormulation(drugs[drugId], selected, onSelect)}
              {selected !== null ? <Text>{currentDrug.formulations[drug.formulationSelected].description}</Text> : null}
              {selected !== null && administrationRouteCategories.includes(currentDrug.formulations[selected].administration_route_category) ? (
                <Text key={`text_${drugId}`}>{currentDrug.formulations[drug.formulationSelected].injection_instructions}</Text>
              ) : null}
            </>
          );
        })}
      </ScrollView>
    );
  }
}
