// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Icon, Picker, Text, View } from 'native-base';
import { medicationForms } from '../../../../../frontend_service/constants';
import { styles } from './MedicinesFormulation.style';
import { breakableFraction, drugAgreed, drugDoses } from '../../../../../frontend_service/helpers/Drug.model';
import { roundSup } from '../../../../utils/swissKnives';

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
   * @param calculatedFormulation
   * @returns {string}
   */
  formulationLabel = (calculatedFormulation) => {
    const {
      app: { t },
    } = this.props;

    switch (calculatedFormulation.medication_form) {
      case medicationForms.pessary:
      case medicationForms.spray:
      case medicationForms.patch:
      case medicationForms.inhaler: {
        return `${calculatedFormulation.description}: ${parseInt(calculatedFormulation.unique_dose)} ${t(`medication_form:${calculatedFormulation.medication_form}`).toLowerCase()}`;
      }
      case medicationForms.tablet:
      case medicationForms.capsule: {
        if (calculatedFormulation.by_age) {
          return `${calculatedFormulation.description}: ${roundSup(calculatedFormulation.unique_dose)} ${t('drug:tablets')}`;
        }
        return `${parseInt(calculatedFormulation.dose_form)}mg ${calculatedFormulation.medication_form}: ${
          calculatedFormulation.doseResult !== null ? `${breakableFraction(calculatedFormulation)} ${t('drug:tablets')}` : t('drug:no_options')
        }`;
      }
      case medicationForms.cream:
      case medicationForms.ointment:
      case medicationForms.gel:
      case medicationForms.drops: {
        return `${calculatedFormulation.description}`;
      }
      case medicationForms.syrup:
      case medicationForms.suspension:
      case medicationForms.powder_for_injection:
      case medicationForms.solution: {
        if (calculatedFormulation.by_age) {
          return `${calculatedFormulation.description}: ${parseInt(calculatedFormulation.unique_dose)}ml`;
        }
        return `${parseInt(calculatedFormulation.liquid_concentration)}mg/${parseInt(calculatedFormulation.dose_form)}ml ${t(`medication_form:${calculatedFormulation.medication_form}`).toLowerCase()}: ${
          calculatedFormulation.doseResult
        }ml ${t('medication_form:per_administration')}`;
      }
      default: {
        return `(${calculatedFormulation.medication_form}) ${t('drug:medication_form_not_handled')}`;
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
              const calculatedFormulation = drugDoses(index, algorithm, instance.id);
              let isPossible = true;

              if (calculatedFormulation.no_possibility !== undefined) {
                isPossible = false;
              }

              // Only one option so pre-select it if possible
              if (algorithm.nodes[instance.id]?.formulations.length === 1 && isPossible && index !== selected) {
                onSelect(index);
              }

              return <Picker.Item key={calculatedFormulation} label={this.formulationLabel(calculatedFormulation)} value={isPossible ? index : false} />;
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
        {Object.keys(drugs).length > 0 && (
          <>
            <Text customTitle>{t('diagnoses:which')}</Text>
            <View style={styles.warningBloc}>
              <Text white>{t('diagnoses:formulation_mandatory')}</Text>
            </View>
          </>
        )}

        {Object.keys(drugs).map((drugId) => {
          const currentDrug = algorithm.nodes[drugId];
          const drug = drugs[drugId];

          const selected = drug.formulationSelected === undefined ? null : drug.formulationSelected;
          const onSelect = (value) => this.onValueChange(value, drugs[drugId], drugId);

          return (
            <>
              {this._renderFormulation(drugs[drugId], selected, onSelect)}
              {selected !== null ? <Text>{currentDrug.formulations[drug.formulationSelected].description}</Text> : null}
            </>
          );
        })}
      </ScrollView>
    );
  }
}
