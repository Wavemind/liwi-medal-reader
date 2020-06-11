// @flow

import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { Button, Icon, Input, Text, View } from "native-base";
import MultiSelect from "react-native-multiple-select";

import { styles } from "./FinalDiagnosticsList.style";
import { FinalDiagnosticModel } from "../../../frontend_service/engine/models/FinalDiagnostic.model";
import FinalDiagnostic from "../FinalDiagnostic";
import { liwiColors } from "../../utils/constants";

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
      medicalCase,
      app: { t },
    } = this.props;
    const { finalDiagnostics, customDiagnoses } = this.state;
    const selected = Object.keys(diagnoses.additional).map((s) => diagnoses.additional[s].id);

    return (
      <React.Fragment>
        <Text customTitle>
          {t('diagnoses:proposed')} {medicalCase.algorithm_name}
        </Text>
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
          searchInputStyle={styles.selectColor}
          submitButtonColor={liwiColors.redColor}
          submitButtonText={t('diagnoses:close')}
        />

        <Text customTitle>{t('diagnoses:custom')}</Text>
        <View style={styles.customContent}>
          <Input style={styles.flex} common value={customDiagnoses} onChange={this._handleCustomInput} />
          <Button style={styles.width50} onPress={this._addCustom}>
            <Icon active name="create-new-folder" type="MaterialIcons" style={styles.iconSize} />
          </Button>
        </View>
        {diagnoses.custom.map((d) => (
          <View style={styles.customItem}>
            <Text style={styles.flex} size-auto>
              {d.label}
            </Text>
            <Button style={styles.width50} onPress={() => this._removeCustom(d)}>
              <Icon active name="delete" type="AntDesign" style={styles.iconSize} />
            </Button>
          </View>
        ))}
      </React.Fragment>
    );
  }
}
