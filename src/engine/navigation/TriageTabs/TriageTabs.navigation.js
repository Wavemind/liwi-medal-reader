import React, { Component } from 'react';
import { Col, Grid, Text, View } from 'native-base';
import { styles } from './TriageTabs.style';

export default class TriageTabs extends Component {
  _renderRound = (n, active) => {
    return (
      <View style={[styles.round, active ? styles.active : styles.unactive]}>
        <View flex-center>
          <Text dark>{n}</Text>
        </View>
      </View>
    );
  };

  render() {
    const {
      t,
      navigation: {
        state: { index },
      },
    } = this.props;

    console.log(this.props.navigation.state.index);

    return (
      <View style={styles.container}>
        <View flex-container-row>
          <View flex-center-stretch>
            {this._renderRound(1, index === 0)}
            <Text center>{t('triage:assessment')}</Text>
          </View>
          <View flex-center-stretch>
            {this._renderRound(2, index === 1)}
            <Text center>{t('triage:vital')}</Text>
          </View>
          <View flex-center-stretch>
            {this._renderRound(3, index === 2)}
            <Text center>{t('triage:comorbidities')}</Text>
          </View>
          <View flex-center-stretch>
            {this._renderRound(4, index === 3)}
            <Text center>{t('triage:vaccination')}</Text>
          </View>
          <View flex-center-stretch>
            {this._renderRound(5, index === 4)}
            <Text center>{t('triage:chief')}</Text>
          </View>
        </View>
      </View>
    );
  }
}
