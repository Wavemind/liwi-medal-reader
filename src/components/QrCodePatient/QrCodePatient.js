// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './QrCodePatient.style';
import { AppRegistry, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as _ from 'lodash';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { liwiColors, screenHeight, screenWidth } from '../../utils/constants';
import { getItem } from '../../engine/api/LocalStorage';
import { displayNotification } from '../../utils/CustomToast';

type Props = NavigationScreenProps & {};

type State = {};

export default class QrCodePatient extends React.Component<Props, State> {
  state = {
    generateNewQR: false,
    otherQR: null,
    newId: false,
  };

  onSuccess = async (e) => {
    const { database, t } = this.props.app;
    const { navigation, closeModal } = this.props;
    const { generateNewQR, otherQR } = this.state;
    const json = await JSON.parse(e.data);

    if (_.isEqual(otherQR, json)) {
      return;
    }

    // QRcode valid ?
    if ('uid' in json && 'studyID' in json && 'groupID' in json) {
      const session = await getItem('session');
      const sameFacility = session?.group?.id === json.groupID;
      const patient = sameFacility ? await database.findBy('Patient', json.uid, 'uid') : await database.findBy('Patient', json.uid, 'second_uid');

      if (patient !== null) {
        navigation.navigate('PatientProfile', {
          id: patient.id,
        });
        displayNotification(t('qrcode:open'), liwiColors.greenColor);
        closeModal();
      }
      // Correct facility but patient does not exist
      else if (sameFacility && patient === null) {
        navigation.navigate('PatientUpsert', {
          idPatient: null,
          newMedicalCase: true,
          identifier: {
            ...json,
          },
          otherFacilityData: otherQR,
        });
        // TODO remove duplication
        displayNotification(t('qrcode:open'), liwiColors.greenColor);
        closeModal();
      }
      // Another medical center
      else {
        // We give him another QR sticker
        await this.setState({ generateNewQR: true, otherQR: json });
      }
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;

    const { generateNewQR } = this.state;
    return (
      <View style={styles.content}>
        <Text style={styles.centerText} customSubTitle>
          {generateNewQR ? 'You need to generate a new sticker' : t('qrcode:scan')}
        </Text>

        <QRCodeScanner
          onRead={this.onSuccess}
          showMarker
          containerStyle={{ flex: 1, flexDirection: 'column' }}
          reactivate={true}
          reactivateTimeout={2000}
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
