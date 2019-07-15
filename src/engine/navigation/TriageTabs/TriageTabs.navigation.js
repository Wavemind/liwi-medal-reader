import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { styles } from './TriageTabs.style';
import { TouchableOpacity } from 'react-native';

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

  onPress = (path) => {
    this.props.navigation.navigate(path);
  };

  render() {
    const {
      t,
      navigation: {
        state: { index },
      },
    } = this.props;

    return (
      <View style={styles.container}>
        <View flex-container-row>
          <TouchableOpacity
            onPress={() => this.onPress('Assessments')}
            style={styles.touchable}
          >
            {this._renderRound(1, index === 0)}
            <Text center>{t('triage:assessment')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPress('ChiefComplaints')}
            style={styles.touchable}
          >
            {this._renderRound(2, index === 1)}
            <Text center>{t('triage:chief')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPress('VitalSigns')}
            style={styles.touchable}
          >
            {this._renderRound(3, index === 2)}
            <Text center>{t('triage:vital')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPress('Comorbidities')}
            style={styles.touchable}
          >
            {this._renderRound(4, index === 3)}
            <Text center>{t('triage:comorbidities')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPress('Vaccinations')}
            style={styles.touchable}
          >
            {this._renderRound(5, index === 4)}
            <Text center>{t('triage:vaccination')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
