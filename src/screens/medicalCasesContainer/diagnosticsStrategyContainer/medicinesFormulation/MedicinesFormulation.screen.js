// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Icon, Picker, Text, View } from 'native-base';
import { administrationRouteCategories } from '../../../../../frontend_service/constants';
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
              let string = f.description;
              let isPossible = true;

              if (preCalculed.no_possibility !== undefined) {
                string = preCalculed.no_possibility;
                isPossible = false;
              }

              // Only one option so pre-select it if possible
              if (algorithm.nodes[instance.id]?.formulations.length === 1 && isPossible && index !== selected) {
                onSelect(index);
              }

              return <Picker.Item key={f} label={string} value={isPossible ? index : false} />;
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
