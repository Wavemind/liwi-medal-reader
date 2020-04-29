// @flow

import * as React from 'react';
import * as _ from 'lodash';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';

import { styles } from './QrCodePatient.style';
import { getItem } from '../../engine/api/LocalStorage';
import { liwiColors } from '../../utils/constants';
import { displayNotification } from '../../utils/CustomToast';

type Props = NavigationScreenProps & {};

type State = {};

export default class QrCodePatient extends React.Component<Props, State> {
  state = {
    generateNewQR: false,
    otherQR: null,
  };

  onSuccess = async (e) => {
    const {
      navigation,
      closeModal,
      app: { database, t },
    } = this.props;
    const { otherQR } = this.state;
    const json = await JSON.parse(e.data);

    console.log(json);

    if (_.isEqual(otherQR, json)) {
      return;
    }

    // QRcode valid ?
    if ('uid' in json && 'studyId' in json && 'groupId' in json) {
      const session = await getItem('session');
      const sameFacility = session?.group?.id === json.groupId;
      const patient = sameFacility ? await database.findBy('Patient', json.uid, 'uid') : await database.findBy('Patient', json.uid, 'otherUid');

      if (patient !== null) {
        navigation.navigate('PatientProfile', {
          id: patient.id,
        });
        displayNotification(t('qrcode:open'), liwiColors.greenColor);
        closeModal();
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
          {generateNewQR ? t('qrcode:new') : t('qrcode:scan')}
        </Text>

        <QRCodeScanner onRead={this.onSuccess} showMarker reactivate reactivateTimeout={2000} cameraStyle={styles.camera} containerStyle={styles.content} markerStyle={styles.marker} />
      </View>
    );
  }
}
