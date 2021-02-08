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

  /**
   * Parse TIMCI QR code data because they didn't want to use the existing format just to piss us off
   * @param QRData : String value comming from QRCODE
   * @returns {{uid: number, group_id: number, study_id}} : Formated data
   */
  parseHeleneQR = (QRData) => {
    const regexStudy = /^[IKMST]/;
    const regexGroup = /\d{4}/g;

    const study_id = QRData.match(regexStudy)[0];
    const digits = [...QRData.matchAll(regexGroup)].flat();

    return {
      study_id,
      group_id: parseInt(digits[0]),
      uid: parseInt(digits[1]),
    };
  };

  onSuccess = async (e) => {
    const {
      navigation,
      app: { database, t },
    } = this.props;
    const { otherQR, generateNewQR } = this.state;
    let QRData = null;

    // Data example : T-F0049-P0002
    const regexHelene = /^[IKMST](-F)\d{4}(-P)\d{4}$/;

    if (e.data.match(regexHelene)) {
      QRData = this.parseHeleneQR(e.data);
    } else {
      try {
        QRData = await JSON.parse(e.data);
      } catch (e) {
        displayNotification(t('qrcode:new_sticker_wrong_facility'), liwiColors.orangeColor);
      }
    }

    if (_.isEqual(otherQR, QRData)) {
      return;
    }

    // QR code valid ?
    if ('uid' in QRData && 'study_id' in QRData && 'group_id' in QRData) {
      const session = await getItem('session');

      const sameFacility = session?.facility?.id === parseInt(QRData.group_id);

      const patient = sameFacility ? await database.findBy('Patient', QRData.uid, 'uid') : await database.findBy('Patient', QRData.uid, 'other_uid');

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
            ...QRData,
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
        await this.setState({ generateNewQR: true, otherQR: QRData });
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
