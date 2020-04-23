// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './QrCodePatient.style';
import { AppRegistry, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { liwiColors, screenHeight, screenWidth } from '../../utils/constants';
import { getItem } from '../../engine/api/LocalStorage';
type Props = NavigationScreenProps & {};

type State = {};

export default class QrCodePatient extends React.Component<Props, State> {
  state = {
    readSuccess: false,
  };

  onSuccess = async (e) => {
    const { showSuccessToast, database, t } = this.props.app;
    const { navigation, closeModal } = this.props;
    const json = await JSON.parse(e.data);

    // QRcode valid ?
    if ('uid' in json && 'studyID' in json && 'groupID' in json) {
      this.setState({ readSuccess: true });

      const patients = await database.getAll('Patient');
      let patient = null;
      patients.map((patientItem) => {
        console.log(patientItem);
        if (patientItem?.identifier?.uid === json.uid) {
          patient = patientItem;
        }
      });

      const session = await getItem('session');

      console.log(patient, patients, session, json);

      if (patient !== null) {
        // Patient exist what ever the medical station (already declared outsider if goes here)
        navigation.navigate('PatientUpsert', {
          idPatient: json.uid,
          newMedicalCase: true,
        });
      } else if (session?.group?.id !== json.groupID) {
        // This patient is not from this medical station
        navigation.navigate('PatientUpsert', {
          idPatient: null,
          newMedicalCase: true,
          outsider: {
            ...json,
            reason: '',
          },
        });
      } else if (patient === null && session?.group?.id === json.groupID) {
        // Correct medical station but patient does not exist
        navigation.navigate('PatientUpsert', {
          idPatient: null,
          newMedicalCase: true,
          identifier: {
            ...json,
          },
        });
      }

      showSuccessToast(t('qrcode:open'));
      closeModal();
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;

    const { readSuccess } = this.state;

    return (
      <View style={styles.content}>
        <Text style={styles.centerText} customSubTitle>
          {t('qrcode:scan')}
        </Text>
        <QRCodeScanner
          onRead={this.onSuccess}
          showMarker
          containerStyle={{ flex: 1, flexDirection: 'column' }}
          reactivate={readSuccess}
          cameraStyle={{ height: 100, width: 'auto', flex: 1 }}
          markerStyle={{
            width: screenWidth / 2,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderColor: liwiColors.whiteColor,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderRadius: 3,
            position: 'relative',
          }}
        />
      </View>
    );
  }
}
