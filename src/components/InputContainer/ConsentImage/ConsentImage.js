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
import { LeftButton, RightButton } from '../../../template/layout';

type Props = NavigationScreenProps & { autoCapitalize: string };
type State = {};

export default class ConsentImage extends React.Component<Props, State> {
  checkLicense = async () => {
    if (await ScanbotSDK.isLicenseValid()) {
      // OK - we have a trial session, a valid trial license or valid production license.
      return true;
    }
    displayNotification('Scanbot SDK trial period or license has expired!', liwiColors.redColor);
    return false;
  };

  startDocumentScannerButtonTapped = async () => {
    const { app, addConsentFile } = this.props;

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
      const regexp = /([^?]+).*/; // Used to remove unwanted params at the end of url
      await ScanbotSDK.applyImageFilterOnPage(result.pages[0], 'COLOR_DOCUMENT');
      addConsentFile(await RNFS.readFile(`${result.pages[0].documentImageFileUri.match(regexp)[1]}?${Date.now()}`, 'base64'));
    }
  };

  renderRenewConsent = () => {
    const {
      app: { t },
      medicalCase,
      updateMedicalCaseProperty,
    } = this.props;

    return (
      <>
        <Text>Consent to data processing for this visit. NO if revoked</Text>
        <View style={styles.flexRow}>
          <LeftButton active={medicalCase.consent === true} onPress={() => updateMedicalCaseProperty('consent', true)}>
            <Text white={medicalCase.consent === true} center>
              {t('question:yes')}
            </Text>
          </LeftButton>
          <RightButton active={medicalCase.consent === false} onPress={() => updateMedicalCaseProperty('consent', false)}>
            <Text center white={medicalCase.consent === false}>
              {t('question:no')}
            </Text>
          </RightButton>
        </View>
      </>
    );
  };

  render() {
    const {
      app: { t },
      medicalCase,
      newPatient,
    } = this.props;
    const disabled = medicalCase.patient.consent_file === null;
    return (
      <View>
        <Text customSubTitle>{t('consent_image:title')}</Text>
        {newPatient && medicalCase.consent === null ? null : this.renderRenewConsent()}
        <View style={styles.flexRow}>
          {newPatient ? (
            <Button style={styles.flex} onPress={this.startDocumentScannerButtonTapped}>
              <Text style={styles.flexCenter}>{t('consent_image:scan')}</Text>
            </Button>
          ) : null}
          <Button style={styles.flex} disabled={disabled} onPress={() => NavigationService.navigate('ConsentPreview')}>
            <Text style={styles.flexCenter}>{t('consent_image:show')}</Text>
          </Button>
        </View>
      </View>
    );
  }
}
