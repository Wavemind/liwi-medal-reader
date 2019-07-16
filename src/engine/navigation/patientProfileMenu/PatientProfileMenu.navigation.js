import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { styles } from './PatientProfilemenu.style';
import { TouchableOpacity, Image } from 'react-native';

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
      navigation: {
        state: { index },
      },
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
              resizeMode={'contain'}
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
              resizeMode={'contain'}
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
              resizeMode={'contain'}
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
