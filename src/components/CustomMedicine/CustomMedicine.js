import React, { Component } from 'react';

import { Button, Icon, Input, Text, View, Card, CardItem, Body } from 'native-base';
import { styles } from './CustomMedicine.style';
import { LiwiTitle2 } from '../../template/layout';

export default class CustomMedicine extends Component<{}> {
  state = {
    customDrug: '',
  };

  /**
   * Save drug name in state
   * @param {String} value
   * @private
   */
  _handleCustomInput = (value) => {
    this.setState({ customDrug: value.nativeEvent.text });
  };

  /**
   * Remove drug from redux store
   * @param {Object} medicine
   * @private
   */
  _removeCustom = (medicine) => {
    const { setCustomMedicine, diagnoseKey } = this.props;
    setCustomMedicine(diagnoseKey, medicine, 'remove');
  };

  /**
   * Add drug in redux store
   * @private
   */
  _addCustom = () => {
    const { setCustomMedicine, diagnoseKey } = this.props;
    const { customDrug } = this.state;
    setCustomMedicine(diagnoseKey, customDrug, 'add');
    this.setState({ customDrug: '' });
  };

  render() {
    const {
      diagnose,
      app: { t },
    } = this.props;

    const { customDrug } = this.state;

    return (
      <Card>
        <CardItem style={styles.cardItemCondensed}>
          <View style={styles.cardItemTitleContent}>
            <Text customSubTitle style={styles.cardItemTitle}>
              {diagnose.label}
            </Text>
            <LiwiTitle2 noBorder style={styles.noRightMargin}>
              <Text note>{t('diagnoses_label:custom')}</Text>
            </LiwiTitle2>
          </View>
        </CardItem>
        <CardItem bordered style={styles.cardItemCondensed}>
          <Body>
            {diagnose.drugs.map((drug) => (
              <View key={`${diagnose.label}-${drug}`} style={styles.drugContainer}>
                <Text style={styles.input}>{drug}</Text>
                <Button style={styles.button} onPress={() => this._removeCustom(drug)}>
                  <Icon active name="delete" type="MaterialIcons" style={styles.icon} />
                </Button>
              </View>
            ))}

          </Body>
        </CardItem>
        <CardItem style={styles.cardItemCondensed}>
          <View style={styles.item}>
            <Input style={styles.input} question value={customDrug} onChange={this._handleCustomInput} placeholder={t('diagnoses:write')} />
            <Button style={styles.button} onPress={this._addCustom}>
              <Icon style={styles.icon} active name="add" type="MaterialIcons" />
            </Button>
          </View>
        </CardItem>
      </Card>
    );
  }
}
