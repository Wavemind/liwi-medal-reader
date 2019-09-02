// @flow
import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './TriageTabs.style';
import type { StateApplicationContext } from '../../contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class TriageTabs extends Component<Props, State> {
  _renderRound = (n, active) => {
    return (
      <View style={[styles.round, active ? styles.active : styles.unactive]}>
        <View flex-center>
          <Text dark>{n}</Text>
        </View>
      </View>
    );
  };

  // One-liner
  // eslint-disable-next-line react/destructuring-assignment
  onPress = (path) => this.props.navigation.navigate( path );

  render() {
    const {
      app: { t },
      navigation: {
        state: { index },
      },
    } = this.props;

    return (
      <View style={styles.container}>
        <View flex-container-row>
          <TouchableOpacity
            onPress={() => this.onPress('FirstLookAssessments')}
            style={styles.touchable}
          >
            {this._renderRound(1, index === 0)}
            <Text center>{t('triage:first_look_assessment')}</Text>
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
            onPress={() => this.onPress('ChronicalConditions')}
            style={styles.touchable}
          >
            {this._renderRound(4, index === 3)}
            <Text center>{t('triage:chronical_condition')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPress('Others')}
            style={styles.touchable}
          >
            {this._renderRound(5, index === 4)}
            <Text center>{t('triage:other')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
