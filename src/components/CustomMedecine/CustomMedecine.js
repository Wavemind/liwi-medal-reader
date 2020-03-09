import React, { Component } from 'react';

import { Icon, Text, View, Button, Input } from 'native-base';
import { SeparatorLine } from '../../template/layout';

export default class CustomMedecine extends Component<{}> {
  state = {
    customDrug: '',
  };

  _handleCustomInput = (value) => {
    this.setState({ customDrug: value.nativeEvent.text });
  };

  _removeCustom = (medecine) => {
    const { setCustomMedecine, diagnoseKey } = this.props;
    setCustomMedecine(diagnoseKey, medecine, 'remove');
  };

  _addCustom = () => {
    const { setCustomMedecine, diagnoseKey } = this.props;
    const { customDrug } = this.state;
    setCustomMedecine(diagnoseKey, customDrug, 'add');
    this.setState({ customDrug: '' });
  };

  render() {
    const {
      diagnose,
      app: { t },
    } = this.props;

    const { customDrug } = this.state;

    return (
      <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 2, marginBottom: 20 }}>
        <Text smallTitle size-auto>
          {diagnose.label}
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
          <Input style={{ flex: 1 }} common value={customDrug} onChange={this._handleCustomInput} placeholder={'Write the medecine'} />
          <Button style={{ width: 50 }} onPress={this._addCustom}>
            <Icon style={{ fontSize: 18 }} active name="create-new-folder" type="MaterialIcons" />
          </Button>
        </View>

        {diagnose.drugs.map((c) => (
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ flex: 1 }}>{c}</Text>
            <Button style={{ width: 50 }} onPress={() => this._removeCustom(c)}>
              <Icon active name="delete" type="AntDesign" style={{ fontSize: 18 }} />
            </Button>
          </View>
        ))}
      </View>
    );
  }
}
