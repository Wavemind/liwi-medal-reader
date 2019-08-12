// @flow
import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './ConsultationTabs.style';
import type { StateApplicationContext } from '../../contexts/Application.context';

type Props = NavigationScreenProps & { app: StateApplicationContext};

type State = StateApplicationContext & {};

export default class ConsultationTabs extends Component<Props, State> {
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
    const {navigation} = this.props;
    navigation.navigate(path);
  };

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
            onPress={() => this.onPress('MedicalHistory')}
            style={styles.touchable}
          >
            {this._renderRound(1, index === 0)}
            <Text center>{t('consultation:medical_history')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPress('PhysicalExam')}
            style={styles.touchable}
          >
            {this._renderRound(2, index === 1)}
            <Text center>{t('consultation:physical_exam')}</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}
