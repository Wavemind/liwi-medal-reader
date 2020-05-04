// @flow
import * as React from 'react';
import PINCode from '@haskkor/react-native-pincode';
import { Image, ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';

import { liwiColors, screensScale, screenWidth } from '../../../utils/constants';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import { userRoles } from '../../../../frontend_service/constants';
import { getItem } from '../../../engine/api/LocalStorage';
import { styles } from './UnlockSession.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import { displayNotification } from '../../../utils/CustomToast';
import NavigationService from '../../../engine/navigation/Navigation.service';

export default function PinSession() {
  const [session, setSession] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('success');
  const app = React.useContext(ApplicationContext);

  React.useEffect(() => {
    (async function getSessionStorage() {
      setSession(await getItem('session'));
      setReady(true);
    })();
  }, []);

  if (ready === false) {
    return null;
  }

  /**
   * Get group, algorithm and store it in local storage
   * @returns {Promise<void>}
   */
  const createSession = async () => {
    setLoading(true);
    await app.setInitialData();
    await app.subscribePingApplicationServer();
    setLoading(false);
  };

  /**
   * Get the pin code from screen
   * Redirect to userSelection if not opened
   * Redirect to home if already opened
   * @params { string }: pinCode : pin code from screen
   */
  const openSession = async (pinCode) => {
    const { user, t } = app;
    setLoading(true);

    if (session.group.pin_code === pinCode) {
      displayNotification(t('notifications:connection_successful'), liwiColors.greenColor);
      await app.setInitialData();

      if (user === null) {
        await setTimeout(async () => {
          NavigationService.navigate('UserSelection');
        }, 10000);
      } else {
        app.set('logged', true);
      }
      setStatus('success');
    } else {
      setStatus('failure');
    }
    setLoading(false);
  };

  return (
    <ScrollView>
      <View testID="UnLockSession" style={styles.flex}>
        <View flex-container-column>
          {session?.group === null ? (
            <View margin-auto padding-auto style={styles.flex}>
              <View style={styles.bloc}>
                {loading ? (
                  <LiwiLoader />
                ) : (
                  <>
                    <Text bigTitle noBorder>
                      {app.t('unlock_session:title')}
                    </Text>
                    <Text size-auto>{app.t('unlock_session:assign')}</Text>
                    <Button onPress={createSession} disabled={!app.isConnected} testID="new_session" style={styles.buttonSync}>
                      <Text size-auto>{app.t('unlock_session:sync_group')}</Text>
                    </Button>
                  </>
                )}
              </View>
              {!app.isConnected && <Text>{app.t('notifications:no_internet')}</Text>}
            </View>
          ) : (
            <>
              {app.user !== null && (
                <View style={styles.appContent}>
                  <Image style={styles.imgKeys} resizeMode="contain" source={require('../../../../assets/images/keys.png')} />
                  <Text style={styles.align} bigTitle={screenWidth > screensScale.s}>
                    {app.t('unlock_session:already')}
                    {'\n '}
                    <Text style={styles.textRole} bigTitle={screenWidth > screensScale.s}>
                      {app.user.first_name} {app.user.last_name}{' '}
                    </Text>
                    {userRoles[app.user.role]}
                  </Text>
                  <Button onPress={app.logout} style={styles.buttonLogout}>
                    <Text size-auto>{app.t('unlock_session:logout')}</Text>
                  </Button>
                </View>
              )}

              <PINCode
                passwordLength={session.group.pin_code.length}
                endProcessFunction={openSession}
                disableLockScreen
                status="enter"
                pinStatus={status}
                titleComponent={() => <Text style={styles.textCustom}>{app.t('unlock_session:pin')} </Text>}
                storedPin={session.group.pin_code}
                colorCircleButtons={liwiColors.darkerGreyColor}
                colorPassword={liwiColors.redColor}
                stylePinCodeButtonNumber={liwiColors.whiteColor}
                numbersButtonOverlayColor={liwiColors.redColor}
                stylePinCodeDeleteButtonColorShowUnderlay={liwiColors.redColor}
                stylePinCodeDeleteButtonColorHideUnderlay={liwiColors.darkerGreyColor}
                stylePinCodeColorTitle={liwiColors.redColor}
                stylePinCodeDeleteButtonSize={30}
                stylePinCodeDeleteButtonText={styles.stylePinCodeDeleteButtonText}
                stylePinCodeRowButtons={styles.stylePinCodeRowButtons}
                stylePinCodeColumnButtons={styles.stylePinCodeColumnButtons}
                stylePinCodeMainContainer={styles.stylePinCodeMainContainer}
                stylePinCodeColumnDeleteButton={styles.stylePinCodeColumnDeleteButton}
                stylePinCodeButtonCircle={styles.stylePinCodeButtonCircle}
              />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
