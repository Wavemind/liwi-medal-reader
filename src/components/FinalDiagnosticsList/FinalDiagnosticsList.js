// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Icon, Input, Text, View } from 'native-base';
import MultiSelect from 'react-native-multiple-select';

import { styles } from './FinalDiagnosticsList.style';
import { FinalDiagnosticModel } from '../../../frontend_service/engine/models/FinalDiagnostic.model';
import FinalDiagnostic from '../FinalDiagnostic';
import { liwiColors } from '../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class FinalDiagnosticsList extends React.Component<Props, State> {
  state = {
    finalDiagnostics: FinalDiagnosticModel.all(),
    customDiagnoses: '',
  };

  shouldComponentUpdate(nextProps: Props) {
    const { pageIndex } = this.props;

    if (nextProps.medicalCase.id === undefined) {
      return false;
    }

    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }

    return true;
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
    const { setDiagnoses } = this.props;
    setDiagnoses('custom', diagnosis, 'remove');
  };

  /**
   * Set value of additional diagnoses
   * @param {String} selectedItems
   */
  onSelectedItemsChange = (selectedItems) => {
    const {
      setDiagnoses,
      medicalCase: { nodes },
    } = this.props;
    const obj = {};
    selectedItems.forEach((i) => {
      obj[i] = nodes[i];
    });

    setDiagnoses('additional', obj);
  };

  /**
   * Save custom diagnoses in context
   * @private
   */
  _addCustom = () => {
    const { setDiagnoses } = this.props;
    const { customDiagnoses } = this.state;
    setDiagnoses('custom', { label: customDiagnoses, drugs: [] });
    this.setState({ customDiagnoses: '' });
  };

  render() {
    const {
      setDiagnoses,
      medicalCase: { diagnoses },
      medicalCase,
      app: { t },
    } = this.props;
    const { finalDiagnostics, customDiagnoses } = this.state;
    const selected = Object.keys(diagnoses.additional).map((additionalKey) => diagnoses.additional[additionalKey].id);

    return (
      <React.Fragment>
        <Text customTitle size-auto style={styles.noMarginTop}>
          {t('diagnoses:proposed')} {medicalCase.algorithm_name}
        </Text>
        {finalDiagnostics.included.length > 0 ? (
          finalDiagnostics.included.map((finalDiagnostic) => <FinalDiagnostic {...finalDiagnostic} key={finalDiagnostic.id} setDiagnoses={setDiagnoses} />)
        ) : (
          <Text style={styles.italic}>{t('diagnoses:no_proposed')}</Text>
        )}

        <Text customTitle size-auto style={styles.marginTop30}>
          {t('diagnoses:title_additional')}
        </Text>

        {Object.keys(diagnoses.additional).length > 0 ? (
          Object.keys(diagnoses.additional).map((additionalKey) => (
            <Text key={`additional-${additionalKey}`} style={styles.additionalText}>
              {diagnoses.additional[additionalKey].label}
            </Text>
          ))
        ) : (
          <Text style={styles.italic}>{t('diagnoses:no_additional')}</Text>
        )}

        <Text customTitle size-auto style={styles.marginTop30}>
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

        <Text customTitle size-auto style={styles.marginTop30}>
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
