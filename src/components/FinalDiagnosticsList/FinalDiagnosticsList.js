// @flow

import * as React from 'react';
import { Button, Icon, Input, Text, View } from 'native-base';
import MultiSelect from 'react-native-multiple-select';

import { styles } from './FinalDiagnosticsList.style';
import { finalDiagnosticAll } from '../../../frontend_service/helpers/FinalDiagnostic.model';
import FinalDiagnostic from '../FinalDiagnostic';
import { liwiColors } from '../../utils/constants';

export default class FinalDiagnosticsList extends React.Component {
  state = {
    customDiagnoses: '',
  };

  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 0;
  }

  /**
   * Set value of custom diagnoses
   * @param {String} value
   * @private
   */
  _handleCustomInput = (value) => {
    this.setState({ customDiagnoses: value.nativeEvent.text });
  };

  /**
   * Remove custom diagnosis
   * @param {String} diagnosis
   * @private
   */
  _removeCustom = (diagnosis) => {
    const { app:{algorithm}, setDiagnoses } = this.props;
    setDiagnoses(algorithm, 'custom', diagnosis, 'remove');
  };

  /**
   * Set value of additional diagnoses
   * @param {String} selectedItems
   */
  onSelectedItemsChange = (selectedItems) => {
    const {
      app: {algorithm},
      setDiagnoses,
      medicalCase: { nodes },
    } = this.props;
    const obj = {};
    selectedItems.forEach((i) => {
      obj[i] = nodes[i];
    });

    setDiagnoses(algorithm, 'additional', obj);
  };

  /**
   * Save custom diagnoses in context
   * @private
   */
  _addCustom = () => {
    const { app:{algorithm},setDiagnoses } = this.props;
    const { customDiagnoses } = this.state;
    setDiagnoses(algorithm, 'custom', { label: customDiagnoses, drugs: [] });
    this.setState({ customDiagnoses: '' });
  };

  render() {
    const {
      setDiagnoses,
      medicalCase: { diagnoses },
      app: { t, algorithm },
    } = this.props;
    const { customDiagnoses } = this.state;

    const finalDiagnostics = finalDiagnosticAll(algorithm);
    const selected = Object.keys(diagnoses.additional).map((additionalKey) => diagnoses.additional[additionalKey].id);

    return (
      <React.Fragment>
        <Text customTitle style={styles.noMarginTop}>
          {t('diagnoses:proposed')} {algorithm.algorithm_name}
        </Text>
        {finalDiagnostics.included.length > 0 ? (
          finalDiagnostics.included.map((finalDiagnostic) => <FinalDiagnostic {...finalDiagnostic} key={finalDiagnostic.id} setDiagnoses={setDiagnoses} />)
        ) : (
          <Text italic>{t('diagnoses:no_proposed')}</Text>
        )}

        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:title_additional')}
        </Text>

        {Object.keys(diagnoses.additional).length > 0 ? (
          Object.keys(diagnoses.additional).map((additionalKey) => (
            <Text key={`additional-${additionalKey}`} style={styles.additionalText}>
              {diagnoses.additional[additionalKey].label}
            </Text>
          ))
        ) : (
          <Text italic>{t('diagnoses:no_additional')}</Text>
        )}

        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:additional')}
        </Text>

        <MultiSelect
          hideTags
          items={[...finalDiagnostics.excluded, ...finalDiagnostics.not_defined]}
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
          itemFontSize={15}
          styleRowList={styles.rowStyle}
          displayKey="label"
          searchInputStyle={styles.selectColor}
          submitButtonColor={liwiColors.redColor}
          submitButtonText={t('diagnoses:close')}
        />

        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:custom')}
        </Text>
        <View style={styles.customContent}>
          <Input question style={styles.flex} value={customDiagnoses} onChange={this._handleCustomInput} />
          <Button style={styles.width50} onPress={this._addCustom}>
            <Icon active name="add" type="MaterialIcons" style={styles.iconSize} />
          </Button>
        </View>
        {diagnoses.custom.map((diagnose) => (
          <View key={diagnose.label} style={styles.customContainer}>
            <View style={styles.customText}>
              <Text style={styles.flex} size-auto>
                {diagnose.label}
              </Text>
            </View>
            <Button style={styles.width50} onPress={() => this._removeCustom(diagnose)}>
              <Icon active name="delete" type="MaterialIcons" style={styles.iconSize} />
            </Button>
          </View>
        ))}
      </React.Fragment>
    );
  }
}
