// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text, View, Input, Button, Item } from 'native-base';
import { styles } from './FinalDiagnosticsList.style';
import { FinalDiagnosticModel } from '../../../frontend_service/engine/models/FinalDiagnostic.model';
import FinalDiagnostic from '../FinalDiagnostic';
import MultiSelect from 'react-native-multiple-select';
import { liwiColors } from '../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class FinalDiagnosticsList extends React.Component<Props, State> {
  state = {
    finalDiagnostics: FinalDiagnosticModel.all(),
    customDiagnoses: '',
  };

  // When we clear the store redux
  shouldComponentUpdate(nextProps: Props): boolean {
    const { pageIndex } = this.props;

    if (nextProps.medicalCase.id === undefined) {
      return false;
    }

    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }

    return true;
  }

  _handleCustomInput = (value) => {
    this.setState({ customDiagnoses: value.nativeEvent.text });
  };

  _removeCustom = (diagnosis) => {
    const { setDiagnoses } = this.props;
    setDiagnoses('custom', diagnosis, 'remove');
  };

  onSelectedItemsChange = (selectedItems) => {
    const {
      setDiagnoses,
      medicalCase: { nodes },
    } = this.props;
    const obj = {};
    selectedItems.map((i) => {
      obj[i] = nodes[i];
    });

    setDiagnoses('additional', obj);
  };

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
      app: { t },
      selectedPage,
    } = this.props;
    const { finalDiagnostics, customDiagnoses } = this.state;

    const selected = Object.keys(diagnoses.additional).map((s) => diagnoses.additional[s].id);

    return (
      <React.Fragment>
        <Text customTitle>{t('diagnoses:proposed')}</Text>
        {finalDiagnostics.included.map((f) => (
          <FinalDiagnostic {...f} type="AntDesign" name="checkcircle" key={f.id} style={styles.greenIcon} setDiagnoses={setDiagnoses} />
        ))}

        {Object.keys(diagnoses.additional).length > 0 && <Text customTitle>{t('diagnoses:titleadditional')}</Text>}

        {Object.keys(diagnoses.additional).map((s) => (
          <Text size-auto>- {diagnoses.additional[s].label}</Text>
        ))}

        <Text customTitle>{t('diagnoses:additional')}</Text>

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
          displayKey="label"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor={liwiColors.redColor}
          submitButtonText={t('diagnoses:close')}
        />

        <Text customTitle>{t('diagnoses:custom')}</Text>
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
          <Input style={{ flex: 1 }} common value={customDiagnoses} onChange={this._handleCustomInput} />
          <Button style={{ width: 50 }} onPress={this._addCustom}>
            <Icon active name="create-new-folder" type="MaterialIcons" style={{ fontSize: 18 }} />
          </Button>
        </View>
        {diagnoses.custom.map((d) => (
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ flex: 1 }} size-auto>
              {d.label}
            </Text>
            <Button style={{ width: 50 }} onPress={() => this._removeCustom(d)}>
              <Icon active name="delete" type="AntDesign" style={{ fontSize: 18 }} />
            </Button>
          </View>
        ))}
      </React.Fragment>
    );
  }
}
