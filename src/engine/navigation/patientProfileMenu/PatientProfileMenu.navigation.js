// @flow
import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';
import type { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../contexts/Application.context';

import { styles } from './PatientProfilemenu.style';

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
  onPress = (path) => this.props.navigation.navigate(path);

  render() {
    const {
      navigation,
      medicalCase: { id },
      medicalCase,
    } = this.props;

    const styleImage = {
      width: 40,
      height: 40,
    };

    return (
      <View style={styles.container}>
        <View flex-container-row>
          <TouchableOpacity
            disabled={id === undefined}
            onPress={() =>
              navigation.navigate('PatientProfile', {
                id: medicalCase.patient.id,
              })
            }
            style={styles.touchable}
          >
            <Image
              resizeMode="contain"
              style={styleImage}
              source={require('../../../../assets/images/profil.png')}
            />
            <Text center>Patient Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={id === undefined}
            onPress={() => this.onPress('ChiefComplaints')}
            style={styles.touchable}
          >
            <Image
              resizeMode="contain"
              style={styleImage}
              source={require('../../../../assets/images/summary.png')}
            />
            <Text center>Current Summary</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={id === undefined}
            onPress={() => this.onPress('VitalSigns')}
            style={styles.touchable}
          >
            <Image
              resizeMode="contain"
              style={styleImage}
              source={require('../../../../assets/images/differentiel.png')}
            />
            <Text center>Differential Diagnoses</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
