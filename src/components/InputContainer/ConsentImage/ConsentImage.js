// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'native-base';
import { View } from 'react-native';

import NavigationService from '../../../engine/navigation/Navigation.service';
import { styles } from './ConsentImage.style';
import { LeftButton, RightButton } from '../../../template/layout';

type Props = NavigationScreenProps & { autoCapitalize: string };
type State = {};

export default class ConsentImage extends React.Component<Props, State> {
  /**
   * Displays the consent management form
   * @returns {*}
   */
  renderRenewConsent = () => {
    const {
      app: { t },
      medicalCase,
      updateMedicalCaseProperty,
    } = this.props;

    return (
      <>
        <Text>{t('consent_image:label')}</Text>
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
    const disabled = medicalCase.patient?.consent_file === null;

    return (
      <View>
        <Text customSubTitle>{t('consent_image:title')}</Text>
        {newPatient && medicalCase.consent === null ? null : this.renderRenewConsent()}
        <View style={styles.flexRow}>
          {newPatient ? (
            <Button style={styles.flex} onPress={() => NavigationService.navigate('ConsentCapture')}>
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
