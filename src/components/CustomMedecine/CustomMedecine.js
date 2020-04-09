import React, { Component } from 'react';

import { Icon, Text, View, Button, Input } from 'native-base';
import { styles } from './CustomMedecine.style';
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
      <View style={styles.container}>
        <Text style={styles.title} size-auto>
          {diagnose.label}
        </Text>
        <View style={styles.item}>
          <Input style={styles.input} common value={customDrug} onChange={this._handleCustomInput} placeholder={'Write the medicine'} />
          <Button style={styles.button} onPress={this._addCustom}>
            <Icon style={styles.icon} active name="create-new-folder" type="MaterialIcons" />
          </Button>
        </View>

        {diagnose.drugs.map((c) => (
          <View style={styles.drugContainer}>
            <Text style={styles.input}>{c}</Text>
            <Button style={styles.button} onPress={() => this._removeCustom(c)}>
              <Icon active name="delete" type="AntDesign" style={styles.icon} />
            </Button>
          </View>
        ))}
      </View>
    );
  }
}
