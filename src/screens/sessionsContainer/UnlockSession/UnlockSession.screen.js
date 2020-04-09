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

export default function PinSession() {
  const [session, setSession] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('success');
  const [pin, setPin] = React.useState(0);
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
    <View testID="UnLockSession" style={{ flex: 1 }}>
      <View flex-container-column>
        {session?.group === null ? (
          <View margin-auto padding-auto style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                alignContent: 'center',
                marginTop: -50,
              }}
            >
              {loading ? (
                <LiwiLoader />
              ) : (
                <>
                  <Text bigTitle noBorder>
                    {app.t('unlock_session:title')}
                  </Text>
                  <Text size-auto>{app.t('unlock_session:assign')}</Text>
                  <Button onPress={syncGroup} disabled={!app.isConnected} testID="new_session" style={{ alignSelf: 'center', marginTop: 30 }}>
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
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Image style={{ width: 90, height: 90, margin: 0 }} resizeMode="contain" source={require('../../../../assets/images/keys.png')} />
                <Text style={{ textAlign: 'center' }} bigTitle>
                  Already Logged as{' '}
                  <Text style={{ textAlign: 'center', fontWeight: 'bold' }} bigTitle>
                    {userRole[app.user.role]}
                  </Text>
                </Text>
              </View>
            )}

            <PINCode
              passwordLength={session.group.pin_code.length}
              endProcessFunction={handleResultEnterPin}
              disableLockScreen
              status={'enter'}
              pinStatus={status}
              titleComponent={() => <Text customTitle>Enter the PIN to unlock the tablet</Text>}
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
              stylePinCodeColumnDeleteButton={{
                marginLeft: 30,
                marginRight: -10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              stylePinCodeButtonCircle={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                backgroundColor: 'rgb(78,80,83)',
                borderRadius: 40,
              }}
            />
          </>
        )}
      </View>
    </View>
  );
}
