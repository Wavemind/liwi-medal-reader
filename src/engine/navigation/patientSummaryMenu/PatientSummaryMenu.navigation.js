// @flow

import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './PatientSummaryMenu.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientSummary extends Component<Props, State> {
  onPress = (path) => {
    const { navigation } = this.props;
    navigation.navigate(path);
  };

  render() {
    const {
      navigation,
      medicalCase: { id },
      medicalCase,
      app: { t },
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
              navigation.navigate('Summary', {
                id: medicalCase.patient.id,
                defaultTab: 0,
              })
            }
            style={styles.touchable}
          >
            <Image
              style={styleImage}
              resizeMode="contain"
              source={require('../../../../assets/images/profil.png')}
            />
            <Text center>{t('patient_summary_menu:patient_profile')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={id === undefined}
            onPress={() =>
              navigation.navigate('Summary', {
                id: medicalCase.patient.id,
                defaultTab: 1,
              })
            }
            style={styles.touchable}
          >
            <Image
              resizeMode="contain"
              style={styleImage}
              source={require('../../../../assets/images/summary.png')}
            />
            <Text center>{t('patient_summary_menu:current_summary')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={id === undefined}
            onPress={() =>
              navigation.navigate('Summary', {
                id: medicalCase.patient.id,
                defaultTab: 0,
              })
            }
            style={styles.touchable}
          >
            <Image
              resizeMode="contain"
              style={styleImage}
              source={require('../../../../assets/images/differential.png')}
            />
            <Text center>{t('patient_summary_menu:differential_diagnoses')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
