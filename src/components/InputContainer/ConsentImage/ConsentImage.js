// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'native-base';
import { View } from 'react-native';
import ScanbotSDK from 'react-native-scanbot-sdk';
import RNFS from 'react-native-fs';

import NavigationService from '../../../engine/navigation/Navigation.service';
import { styles } from './ConsentImage.style';
import { liwiColors } from '../../../utils/constants';
import { displayNotification } from '../../../utils/CustomToast';

type Props = NavigationScreenProps & { autoCapitalize: string };
type State = {};

export default class ConsentImage extends React.Component<Props, State> {
  state = { value: '' };

  static defaultProps = {};

  componentDidMount(): void {}

  checkLicense = async () => {
    if (await ScanbotSDK.isLicenseValid()) {
      // OK - we have a trial session, a valid trial license or valid production license.
      return true;
    }
    displayNotification('Scanbot SDK trial period or license has expired!', liwiColors.redColor);
    return false;
  };

  startDocumentScannerButtonTapped = async () => {
    const { app, addConsent } = this.props;

    if (!(await this.checkLicense())) {
      return;
    }
    await app.set('showPinOnUnlock', false);
    const result = await ScanbotSDK.UI.startDocumentScanner({
      // Customize colors, text resources, etc..
      polygonColor: '#ff407d',
      cameraPreviewMode: 'FIT_IN',
      orientationLockMode: 'PORTRAIT',
      multiPageEnabled: false,
      multiPageButtonHidden: true,
      ignoreBadAspectRatio: true,
      shutterButtonHidden: true,
      maxNumberOfPages: 1,
      documentImageSizeLimit: {
        height: 1500,
        width: 750,
      },
    });

    if (result.status === 'OK') {
      const regexp = /([^?]+).*/;
      ScanbotSDK.applyImageFilterOnPage(result.pages[0], 'COLOR_DOCUMENT');
      addConsent(await RNFS.readFile(`${result.pages[0].documentImageFileUri.match(regexp)[1]}?${Date.now()}`, 'base64'));
    }
  };

  render() {
    const { medicalCase } = this.props;
    const disabled = medicalCase.patient.consent === null;

    return (
      <View>
        <Text customSubTitle>Consent</Text>
        <View style={styles.flexRow}>
          <Button style={{ flex: 1 }} onPress={this.startDocumentScannerButtonTapped}>
            <Text style={{ flex: 1, textAlign: 'center' }}>Scan</Text>
          </Button>
          <Button style={{ flex: 1 }} disabled={disabled} onPress={() => NavigationService.navigate('ConsentPreview')}>
            <Text style={{ flex: 1, textAlign: 'center' }}>Show</Text>
          </Button>
        </View>
      </View>
    );
  }
}
