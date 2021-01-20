// @flow

import * as React from 'react';
import * as _ from 'lodash';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Text, View } from 'native-base';

import { styles } from './QrCodePatient.style';
import { getItem } from '../../engine/api/LocalStorage';
import { liwiColors } from '../../utils/constants';
import { displayNotification } from '../../utils/CustomToast';

export default class QrCodePatient extends React.Component {
  state = {
    generateNewQR: false,
    otherQR: null,
  };

  onSuccess = async (e) => {
    const {
      navigation,
      app: { database, t },
    } = this.props;
    const { otherQR, generateNewQR } = this.state;
    const json = await JSON.parse(e.data);

    if (_.isEqual(otherQR, json)) {
      return;
    }

    // QR code valid ?
    if ('uid' in json && 'study_id' in json && 'group_id' in json) {
      const session = await getItem('session');

      const sameFacility = session?.facility?.id === parseInt(json.group_id);

      const patient = sameFacility ? await database.findBy('Patient', json.uid, 'uid') : await database.findBy('Patient', json.uid, 'other_uid');

      if (patient !== null) {
        navigation.navigate('PatientProfile', {
          id: patient.id,
        });
        displayNotification(t('qrcode:open'), liwiColors.greenColor);
      }
      // Correct facility but patient does not exist
      else if (sameFacility) {
        navigation.navigate('PatientUpsert', {
          idPatient: null,
          newMedicalCase: true,
          facility: {
            ...json,
          },
          otherFacility: otherQR,
        });
        // TODO remove duplication
        displayNotification(t('qrcode:open'), liwiColors.greenColor);
      } else if (generateNewQR === true) {
        displayNotification(t('qrcode:new_sticker_wrong_facility'), liwiColors.orangeColor);
      }
      // Another medical center
      else {
        // We give him another QR sticker
        await this.setState({ generateNewQR: true, otherQR: json });
        displayNotification(t('qrcode:new_sticker_notification'), liwiColors.orangeColor);
      }
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;

    const { generateNewQR } = this.state;
    return (
      <>
        <Text style={styles.centerText} customSubTitle>
          {generateNewQR ? t('qrcode:new') : t('qrcode:scan')}
        </Text>
        <View style={styles.content}>
          <QRCodeScanner vibrate onRead={this.onSuccess} showMarker reactivate reactivateTimeout={2000} cameraStyle={styles.camera} containerStyle={styles.content} markerStyle={styles.marker} />
        </View>
      </>
    );
  }
}
