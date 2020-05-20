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
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import Database from '../../../engine/api/Database';

export default class UnLockSession extends React.Component<Props, State> {
  _isMounted = false;

  state = {
    session: null,
    loading: false,
    status: 'success',
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

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * Get group, algorithm and store it in local storage
   * @returns {Promise<void>}
   */
  createSession = async () => {
    this.setState({ loading: true });
    const { app } = this.props;
    const result = await app.setInitialData();
    if (result !== null) {
      const database = await new Database();
      await app.set('database', database);
      await app.subscribePingApplicationServer();
    }
    this.setState({ loading: true });
  };

  /**
   * Get the pin code from screen
   * Redirect to userSelection if not opened
   * Redirect to home if already opened
   * @params { string }: pinCode : pin code from screen
   */
  openSession = async (pinCode) => {
    const { session } = this.state;
    const { app } = this.props;

    if (session.group.pin_code === pinCode) {
      const netInfoConnection = await NetInfo.fetch();
      const { isConnected } = netInfoConnection;
      if (isConnected) {
        await app.setInitialData();
      }
      const database = await new Database();
      await app.set('database', database);

      if (app.user === null) {
        NavigationService.navigate('UserSelection');
      } else {
        app.set('logged', true);
      }
      this.setState({ status: 'success' });
    } else {
      this.setState({ status: 'failure' });
    }
  };

  render() {
    const { app } = this.props;
    const { session, loading, status } = this.state;

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
                      <Button onPress={this.createSession} disabled={!app.isConnected} testID="new_session" style={styles.buttonSync}>
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
                  passwordLength={session?.group.pin_code.length}
                  endProcessFunction={this.openSession}
                  disableLockScreen
                  status="enter"
                  pinStatus={status}
                  titleComponent={() => <Text style={styles.textCustom}>{app.t('unlock_session:pin')} </Text>}
                  storedPin={session?.group.pin_code}
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
}
