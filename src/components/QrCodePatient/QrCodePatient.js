// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './QrCodePatient.style';
import { AppRegistry, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { liwiColors, screenHeight, screenWidth } from '../../utils/constants';
import { getItem } from '../../engine/api/LocalStorage';
import { displayNotification } from '../../utils/CustomToast';
type Props = NavigationScreenProps & {};

type State = {};

export default class QrCodePatient extends React.Component<Props, State> {
  state = {
    rescan: false,
    oldQrcode: null,
    newId: false,
  };

  onSuccess = async (e) => {
    const { database, t } = this.props.app;
    const { navigation, closeModal } = this.props;
    const json = await JSON.parse(e.data);


    // QRcode valid ?
    if ('uid' in json && 'studyID' in json && 'groupID' in json) {
      const patient = await database.findBy('Patient', json.uid, 'uid');


      const session = await getItem('session');

      if ((session?.group?.id !== json.groupID && patient !== null)) {
        await this.setState({ rescan: true });
      }
      console.log(json, session?.group);
      const { rescan, oldQrcode } = this.state;
      if (patient !== null) {
        // Patient exist what ever the medical station (already declared outsider if goes here)
        navigation.navigate('PatientUpsert', {
          idPatient: patient.id,
          newMedicalCase: true,
        });

        // TODO remove duplication
        displayNotification(t('qrcode:open'), liwiColors.greenColor);
        closeModal();
      } else {
        if (session?.group?.id === json.groupID) {
          // Correct medical station but patient does not exist
          navigation.navigate('PatientUpsert', {
            idPatient: null,
            newMedicalCase: true,
            identifier: {
              ...json,
            },
          });
          displayNotification(t('qrcode:open'), liwiColors.greenColor);
          closeModal();
        }
        // Wrong medical center
        else if (rescan === true && oldQrcode !== null) {
          navigation.navigate('PatientUpsert', {
            idPatient: null,
            newMedicalCase: true,
            identifier: { ...json },
            outsider: {
              ...oldQrcode,
            },
          });
          displayNotification(t('qrcode:open'), liwiColors.greenColor);
          closeModal();
          // Going to ask the new Code
          this.setState({ newId: true, oldQrcode: json });
        }
        // We need no scan another QR code for the patient
        else {

        }
      }
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;

    const { rescan, newId } = this.state;

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
          reactivate={rescan}
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
