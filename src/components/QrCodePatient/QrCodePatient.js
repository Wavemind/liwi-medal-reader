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
    oldQrcode: null,
    newId: false,
  };

  onSuccess = async (e) => {
    const { _displayNotification, database, t } = this.props.app;
    const { navigation, closeModal } = this.props;
    const json = await JSON.parse(e.data);

    // QRcode valid ?
    if ('uid' in json && 'studyID' in json && 'groupID' in json) {
      const patients = await database.getAll('Patient');
      let patient = null;
      patients.map(async (patientItem) => {
        const identifier = await JSON.parse(patientItem.identifier);

        if (identifier?.uid === json.uid) {
          patient = patientItem;
        }
      });

      const session = await getItem('session');

      // Stop reading
      if ((session?.group?.id !== json.groupID && patient !== null) || (session?.group?.id === json.groupID && patient === null)) {
        await this.setState({ readSuccess: true });
      }

      const { readSuccess, oldQrcode } = this.state;

      console.log(readSuccess, oldQrcode);

      if (patient !== null) {
        // Patient exist what ever the medical station (already declared outsider if goes here)
        navigation.navigate('PatientUpsert', {
          idPatient: json.uid,
          newMedicalCase: true,
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

      if (session?.group?.id !== json.groupID && readSuccess === true && oldQrcode !== null) {
        navigation.navigate('PatientUpsert', {
          idPatient: null,
          newMedicalCase: true,
          identifier: { ...json },
          outsider: {
            ...oldQrcode,
          },
        });
      } else {
        // need to re scan
        this.setState({ newId: true, oldQrcode: json });
      }

      if (readSuccess) {
        _displayNotification(t('qrcode:open'));
        closeModal();
      }
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;

    const { readSuccess, newId } = this.state;

    return (
      <View style={styles.content}>
        <Text style={styles.centerText} customSubTitle>
          {t('qrcode:scan')}
        </Text>
        {newId && <Text>You have to rescan the new id</Text>}
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
