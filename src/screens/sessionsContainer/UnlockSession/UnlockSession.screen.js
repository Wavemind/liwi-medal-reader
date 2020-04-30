// @flow

import * as React from 'react';
import { Image, ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import PINCode from '@haskkor/react-native-pincode';
import LiwiLoader from '../../../utils/LiwiLoader';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import { liwiColors, screenHeight, screensScale, screenWidth } from '../../../utils/constants';
import { userRoles } from '../../../../frontend_service/constants';
import { getItem } from '../../../engine/api/LocalStorage';
import { styles } from './UnlockSession.style';
import Database from '../../../engine/api/Database';

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

  const syncGroup = async () => {
    setLoading(true);
    await app.getGroupData();
    await app.subscribePingApplicationServer();
    const database = await new Database();
    await app.set('database', database);
    setLoading(false);
  };

  const handleResultEnterPin = async (pinCode) => {
    const pinCheck = await app.openSession(pinCode);

    if (pinCheck) {
      setStatus('success');
    } else {
      setStatus('failure');
    }
  };

  let divider = 10;
  let extraStyle = { width: 80, height: 80 };
  let buttonStyle = { marginTop: 30 };
  let textCustom = { marginTop: 30, color: liwiColors.redColor };

  // Change flex for small screen

  if (screenWidth < screensScale.s) {
    divider = 8;
    extraStyle = { width: 60, height: 60 };
    buttonStyle = { margin: 0, marginTop: 10 };
    textCustom = { marginTop: 10, color: liwiColors.redColor };
  }

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
                    <Button onPress={syncGroup} disabled={!app.isConnected} testID="new_session" style={styles.buttonSync}>
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
                  <Button onPress={app.logout} style={{ ...styles.buttonLogout, ...buttonStyle }}>
                    <Text size-auto>{app.t('unlock_session:logout')}</Text>
                  </Button>
                </View>
              )}

              <PINCode
                passwordLength={session.group.pin_code.length}
                endProcessFunction={handleResultEnterPin}
                disableLockScreen
                status="enter"
                pinStatus={status}
                titleComponent={() => <Text style={{ ...textCustom }}>{app.t('unlock_session:pin')} </Text>}
                storedPin={session.group.pin_code}
                colorCircleButtons={liwiColors.darkerGreyColor}
                colorPassword={liwiColors.redColor}
                stylePinCodeButtonNumber={liwiColors.whiteColor}
                numbersButtonOverlayColor={liwiColors.redColor}
                stylePinCodeDeleteButtonColorShowUnderlay={liwiColors.redColor}
                stylePinCodeDeleteButtonColorHideUnderlay={liwiColors.darkerGreyColor}
                stylePinCodeColorTitle={liwiColors.redColor}
                stylePinCodeDeleteButtonSize={30}
                stylePinCodeDeleteButtonText={{ fontWeight: '200', marginTop: 5, fontSize: 18 }}
                stylePinCodeRowButtons={{ justifyContent: 'center', alignItems: 'center', height: screenHeight / divider }}
                stylePinCodeColumnButtons={{ justifyContent: 'center', alignItems: 'center', width: 'auto' }}
                stylePinCodeMainContainer={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                stylePinCodeColumnDeleteButton={styles.stylePinCodeColumnDeleteButton}
                stylePinCodeButtonCircle={{ ...styles.stylePinCodeButtonCircle, ...extraStyle }}
              />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
