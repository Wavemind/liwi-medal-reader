// @flow

import * as React from 'react';
import { Button, Text, View } from 'native-base';
import { getItem } from '../../../engine/api/LocalStorage';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';
import PINCode from '@haskkor/react-native-pincode';
import { liwiColors, screenHeight } from '../../../utils/constants';
import { Image } from 'react-native';
import { userRole } from '../../../../frontend_service/constants';
import { styles } from './UnlockSession.style';
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
    setLoading(false);
  };

  const handleResultEnterPin = async (pinCode) => {
    let pinCheck = await app.openSession(pinCode);

    if (pinCheck) {
      setStatus('success');
    } else {
      setStatus('failure');
    }
  };

  return (
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
                <Text style={styles.align} bigTitle>
                  {app.t('unlock_session:already')}
                  {'\n '}
                  <Text style={styles.textRole} bigTitle>
                    {app.user.last_name} {app.user.first_name}{' '}
                  </Text>
                  {userRole[app.user.role]}
                </Text>
                <Button onPress={app.logout} style={styles.buttonLogout}>
                  <Text size-auto>{app.t('unlock_session:logout')}</Text>
                </Button>
              </View>
            )}

            <PINCode
              passwordLength={session.group.pin_code.length}
              endProcessFunction={handleResultEnterPin}
              disableLockScreen
              status={'enter'}
              pinStatus={status}
              titleComponent={() => <Text customTitle>{app.t('unlock_session:pin')} </Text>}
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
              stylePinCodeRowButtons={{ justifyContent: 'center', alignItems: 'center', height: screenHeight / 10 }}
              stylePinCodeColumnButtons={{ justifyContent: 'center', alignItems: 'center', width: 'auto' }}
              stylePinCodeMainContainer={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              stylePinCodeColumnDeleteButton={styles.stylePinCodeColumnDeleteButton}
              stylePinCodeButtonCircle={styles.stylePinCodeButtonCircle}
            />
          </>
        )}
      </View>
    </View>
  );
}
