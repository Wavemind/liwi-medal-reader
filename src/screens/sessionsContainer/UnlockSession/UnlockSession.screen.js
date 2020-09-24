// @flow
import * as React from 'react';
import PINCode from '@haskkor/react-native-pincode';
import * as NetInfo from '@react-native-community/netinfo';
import { Button, Text, View } from 'native-base';
import { ScrollView } from 'react-native';

import { liwiColors, screensScale, screenWidth } from '../../../utils/constants';
import { userRoles } from '../../../../frontend_service/constants';
import { getItem } from '../../../engine/api/LocalStorage';
import { styles } from './UnlockSession.style';
import NavigationService from '../../../engine/navigation/Navigation.service';
import Database from '../../../engine/api/Database';
import LiwiLoader from '../../../utils/LiwiLoader';

export default class UnLockSession extends React.Component<Props, State> {
  state = {
    session: null,
    status: 'initial',
    loading: false,
  };

  constructor() {
    super();
    this.init();
  }

  init = async () => {
    const session = await getItem('session');
    this.setState({
      session,
    });
  };

  /**
   * Get the pin code from screen
   * Redirect to userSelection if not opened
   * Redirect to home if already opened
   * @params { string }: pinCode : pin code from screen
   */
  openSession = async (pinCode) => {
    this.setState({ loading: true });
    const { session } = this.state;
    const { app } = this.props;

    if (session.facility.pin_code === pinCode) {
      const netInfoConnection = await NetInfo.fetch();
      const { isConnected } = netInfoConnection;

      if (isConnected) {
        await app.setInitialData();
      } else {
        const algorithm = await getItem('algorithm');
        app.set('algorithm', algorithm);
      }

      const database = await new Database();
      await app.set('database', database);

      if (app.user === null) {
        this.setState({ status: 'success', loading: false });
        NavigationService.navigate('UserSelection');
      } else {
        this.setState({ status: 'success', loading: false });
        app.set('logged', true);
        NavigationService.navigate('App');
      }
    } else {
      this.setState({ status: 'failure', loading: false });
    }
  };

  render() {
    const { app } = this.props;
    const { session, status, loading } = this.state;

    return (
      <ScrollView>
        <View testID="UnLockSession" style={styles.flex}>
          <View flex-container-column>
            {app.user !== null && (
              <View style={styles.appContent}>
                <Text style={styles.align} bigTitle={screenWidth > screensScale.s}>
                  {app.t('unlock_session:current_user')}
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
              passwordLength={session?.facility.pin_code.length}
              endProcessFunction={this.openSession}
              disableLockScreen
              status="enter"
              pinStatus={status}
              titleComponent={() => (
                <Text size-auto style={styles.textCustom}>
                  {app.t('unlock_session:pin')}{' '}
                </Text>
              )}
              subtitleComponent={() => (loading ? <LiwiLoader style={{ width: 50 }} /> : null)}
              storedPin={session?.facility.pin_code}
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
          </View>
        </View>
      </ScrollView>
    );
  }
}
