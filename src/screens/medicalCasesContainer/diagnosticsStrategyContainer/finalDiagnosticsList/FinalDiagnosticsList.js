// @flow

import * as React from 'react';
import { Button, Icon, Input, Text, View } from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import moment from 'moment';

import { TouchableOpacity } from 'react-native';
import { styles } from './FinalDiagnosticsList.style';
import { finalDiagnosticAll } from '../../../../../frontend_service/helpers/FinalDiagnostic.model';
import FinalDiagnostic from '../../../../components/FinalDiagnostic';
import { liwiColors } from '../../../../utils/constants';
import { modalType } from '../../../../../frontend_service/constants';

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
    const {
      app: { algorithm },
      setDiagnoses,
    } = this.props;
    setDiagnoses(algorithm, 'custom', diagnosis, 'remove');
  };

  /**
   * Set value of additional diagnoses
   * @param {String} selectedItems
   */
  onSelectedItemsChange = (selectedItems) => {
    const {
      app: { algorithm },
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
    const {
      app: { algorithm },
      setDiagnoses,
    } = this.props;
    const { customDiagnoses } = this.state;
    setDiagnoses(algorithm, 'custom', { label: customDiagnoses, drugs: [] });
    this.setState({ customDiagnoses: '' });
  };

  /**
   * Filters finalDiagnostics by neoNat or not neoNat
   * @param finalDiagnostics
   * @returns {Array<T>}
   */
  filterByNeonat = (finalDiagnostics) => {
    const {
      app: { algorithm },
      medicalCase,
    } = this.props;

    const items = algorithm.is_arm_control
      ? [...finalDiagnostics.included, ...finalDiagnostics.excluded, ...finalDiagnostics.not_defined]
      : [...finalDiagnostics.excluded, ...finalDiagnostics.not_defined];

    const birthDate = medicalCase.nodes[algorithm.config.basic_questions.birth_date_question_id].value;
    const days = birthDate !== null ? moment().diff(birthDate, 'days') : 0;

    return items
      .filter((item) => {
        if (days <= 60 && algorithm.nodes[item.cc].is_neonat) {
          return true;
        }
        if (days > 60 && !algorithm.nodes[item.cc].is_neonat) {
          return true;
        }
      })
      .sort((a, b) => {
        return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
      });
  };

  /**
   * Open redux modal
   */
  openModal = (questionId) => {
    const {
      app: { algorithm },
      updateModalFromRedux,
    } = this.props;

    const currentNode = algorithm.nodes[questionId];
    updateModalFromRedux({ node: currentNode }, modalType.description);
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
    const items = this.filterByNeonat(finalDiagnostics);

    return (
      <React.Fragment>
        {algorithm.is_arm_control ? null : (
          <>
            <Text customTitle style={styles.noMarginTop}>
              {t('diagnoses:proposed')} {algorithm.algorithm_name}
            </Text>
            {finalDiagnostics.included.length > 0 ? (
              finalDiagnostics.included.map((finalDiagnostic) => <FinalDiagnostic {...finalDiagnostic} key={finalDiagnostic.id} setDiagnoses={setDiagnoses} />)
            ) : (
              <Text italic>{t('diagnoses:no_proposed')}</Text>
            )}
          </>
        )}
        <Text customTitle style={algorithm.is_arm_control ? null : styles.marginTop30}>
          {t('diagnoses:title_additional')}
        </Text>
        {Object.keys(diagnoses.additional).length > 0 ? (
          Object.keys(diagnoses.additional).map((additionalKey) => (
            <View key={`additional-${additionalKey}`} style={styles.container}>
              <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(diagnoses.additional[additionalKey].id)}>
                <Icon type="AntDesign" name="info" style={styles.iconInfo} />
              </TouchableOpacity>
              <Text>{diagnoses.additional[additionalKey].label}</Text>
            </View>
          ))
        ) : (
          <Text italic>{t('diagnoses:no_additional')}</Text>
        )}
        <Text customTitle style={styles.marginTop30}>
          {t('diagnoses:additional')}
        </Text>
        <MultiSelect
          hideTags
          items={items}
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
        {algorithm.is_arm_control ? null : (
          <>
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
          </>
        )}
      </React.Fragment>
    );
  }
}
