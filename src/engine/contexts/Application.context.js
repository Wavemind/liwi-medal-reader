// @flow
import * as React from 'react';
import * as NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { NavigationScreenProps } from 'react-navigation';
import { AppState, PermissionsAndroid } from 'react-native';

import Toast from 'react-native-tiny-toast';
import i18n from '../../utils/i18n';
import NavigationService from '../navigation/Navigation.service';
import Database from '../api/Database';
import { appInBackgroundStateKey, secondStatusLocalData } from '../../../frontend_service/constants';
import { auth, fetchAlgorithms, get, post } from '../../../frontend_service/api/Http';
import { getItem, setItem } from '../api/LocalStorage';
import { getDeviceInformation } from '../api/Device';
import { liwiColors } from '../../utils/constants';

const defaultValue = {};

export const ApplicationContext = React.createContext<Object>(defaultValue);

type Props = NavigationScreenProps & {
  children: React.Node,
};

export type StateApplicationContext = {
  name: string,
  lang: string,
  set: (prop: any, value: any) => Promise<any>,
  logged: boolean,
  user: Object,
  logout: () => Promise<any>,
  unLockSession: (id: number, code: string) => Promise<any>,
  lockSession: () => Promise<any>,
  setMedicalCase: (medicalcase: Object) => Promise<any>,
  isConnected: boolean,
  medicalCase: Object,
  appState: string,
  setModal: () => Promise<any>,
  isModalVisible: boolean,
  contentModal: string,
  t: (string) => Function<string>,
  ready: boolean,
};

export class ApplicationProvider extends React.Component<Props, StateApplicationContext> {
  constructor(props: Props) {
    super(props);
    this._init();
  }

  /**
   * Initialize context and event listener
   * @returns {Promise<void>}
   * @private
   */
  _init = async () => {
    const session = await getItem('session');

    // Session already exist
    if (session !== null && session?.group !== null) {
      await this._handleApplicationServer(true);
      await this.getGroupData(false);

      const user = await getItem('user');
      const { isConnected } = this.state;
      const database = await new Database();

      this.setState({
        session,
        user,
        ready: true,
        database,
        isConnected,
      });

      // Start ping to local or main data server
      this.subscribePingApplicationServer();
    } else {
      // First time tablet is used
      const netInfoConnection = await NetInfo.fetch();
      const { isConnected } = netInfoConnection;
      await setItem('isConnected', isConnected);
      this.setState({ ready: true, isConnected });
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  };

  /**
   * Start an interval to ping application server like main data or local data
   */
  subscribePingApplicationServer = () => {
    this.unsubscribePingApplicationServer = setInterval(this._handleApplicationServer, secondStatusLocalData);
  };

  /**
   * Ping local or main data to define status of the app
   * @param {boolean} firstTime - Force call to this._setAppStatus(false) to initialize it
   * @returns {Promise<void>}
   */
  _handleApplicationServer = async (firstTime = false) => {
    const { isConnected } = this.state;
    const session = await getItem('session');
    const ip = session.group.architecture === 'standalone' ? session.group.main_data_ip : session.group.local_data_ip;
    const request = await fetch(ip, 'GET').catch(async () => {
      if (isConnected || firstTime) {
        await this._setAppStatus(false);
      }
    });
    if (request !== undefined && !isConnected) {
      await this._setAppStatus(true);
    }
  };

  /**
   * Store in state and local storage connection status
   * @param { boolean } status - connection status
   * @returns {Promise<void>}
   * @private
   */
  _setAppStatus = async (status) => {
    await setItem('isConnected', status);
    this.setState({ isConnected: status });
  };

  // TODO comment
  getGeo = async () => {
    const { t } = this.state;
    return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: t('popup:title'),
      message: t('popup:message'),
      buttonNeutral: t('popup:ask_me_later'),
      buttonNegative: t('popup:cancel'),
      buttonPositive: 'Ok !',
    });
  };

  // TODO comment
  askGeo = async (enableHighAccuracy, callBack) => {
    return Geolocation.getCurrentPosition(
      async (position) => callBack(position),
      async (error) => callBack(error),
      {
        enableHighAccuracy,
        timeout: 5000,
      },
    );
  };

  // TODO comment
  // Set value in context
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  // TODO comment
  // Log out
  logout = async () => {
    await setItem('user', null);
    this.setState({
      user: null,
      logged: false,
    });
  };

  // TODO comment
  // Lock current session
  lockSession = async () => {
    this.setState({
      logged: false,
      user: null,
    });
  };

  // TODO comment
  setModal = async (content) => {
    this.setState({
      isModalVisible: true,
      contentModal: content,
    });
  };

  // TODO comment
  /**
   * Get the data for the group
   * Call with the button synchronize in screen UnLockSession.screen.js
   * @return boolean
   */
  getGroupData = async (showToast = true) => {
    const { isConnected, t } = this.state;
    if (isConnected) {
      const session = await getItem('session');
      const deviceInfo = await getDeviceInformation();
      // Send data to server
      const group = await get(`devices/${deviceInfo.mac_address}`);

      // If no error
      if (group !== false && group.errors === undefined) {
        // merge data in local
        await setItem('session', { ...session, group });
        // Set data in context
        await fetchAlgorithms();
        this.setState({ session: { ...session, group } });
        // Show success toast
        showToast ? this.showSuccessToast(t('notifications:get_group')) : null;
        return true;
      }
    }

    return false;
  };

  /**
   * Get the pin code from screen
   * Redirect to userSelection if not opened
   * Redirect to home if already opened
   * @params string: pinCode : pin code from screen
   * @return boolean
   */
  openSession = async (pinCode) => {
    const { session, user, t } = this.state;
    if (session.group.pin_code === pinCode) {
      this.showSuccessToast(t('notifications:connection_successful'));

      if (user === null) {
        await setTimeout(async () => {
          NavigationService.navigate('UserSelection');
        }, 1000);
      } else {
        await setTimeout(async () => {
          this.setState({ logged: true });
        }, 1000);
      }

      return true;
    }
    return false;
  };

  // TODO comment
  setUser = async (user) => {
    // Set user in local storage
    await setItem('user', user);

    // Set user in context
    this.setState({ user, logged: true });
  };

  /**
   * Show a toast with success styles
   *  @params string msg : String to pass in message
   */
  showSuccessToast = (msg) => {
    Toast.showSuccess(msg, {
      position: 20,
      containerStyle: { backgroundColor: liwiColors.greenColor },
      textStyle: { color: liwiColors.whiteColor },
      imgStyle: { height: 40 },
    });
  };

  // TODO comment
  /**
   * Create new session from NewSession
   */
  newSession = async (email: string, password: string) => {
    // auth with server
    const session = await auth(email, password).catch((error) => {
      return error;
    });

    // if no error set the tablet
    if (session?.success !== false) {
      const concatSession = { group: null, ...session };
      // Set item in localstorage
      await setItem('session', concatSession);

      const deviceInfo = await getDeviceInformation();
      // Register device to server
      const register = await post('devices', { device: { ...deviceInfo } }, { token: 'group' });

      if (register === true) {
        // Show toast
        this.showSuccessToast('Successfull tablet identification');
        return true;
      }
    }
    return false;
  };

  state = {
    name: 'App',
    lang: 'fr',
    set: this.setValState,
    logged: false,
    setUser: this.setUser,
    logout: this.logout,
    getGroupData: this.getGroupData,
    subscribePingApplicationServer: this.subscribePingApplicationServer,
    openSession: this.openSession,
    lockSession: this.lockSession,
    newSession: this.newSession,
    isConnected: false,
    medicalCase: {},
    appState: AppState.currentState,
    setModal: this.setModal,
    isModalVisible: false,
    contentModal: 'initial',
    initialPosition: {},
    t: (translate) => i18n.t(translate),
    ready: false,
    currentRoute: null,
    session: null,
    user: null,
  };

  async componentDidMount() {
    let permissionReturned = await this.getGeo();
    let location = {
      coords: {
        accuracy: 0,
        altitude: 0,
        heading: 0,
        latitude: 0,
        longitude: 0,
        speed: 0,
      },
      mocked: false,
      timestamp: 0,
    };
    location.date = moment().toISOString();

    if (permissionReturned === 'granted') {
      await this.askGeo(true, async (cb) => {
        location = { ...location, ...cb };
        await setItem('location', location);
      });
    } else {
      await setItem('location', location);
    }
  }

  componentWillUnmount() {
    clearInterval(this.unsubscribePingApplicationServer);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // If the app is active or not
  _handleAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.warn('---> Liwi came back from background', nextAppState);
      await setItem(appInBackgroundStateKey, true);

      this.setState({ appState: nextAppState, logged: false });
    }

    if (appState.match(/active/) && nextAppState.match(/inactive|background/)) {
      console.warn('---> Liwi is hidding');
      this.setState({ appState: nextAppState });
    }
  };

  render() {
    const { children } = this.props;
    return <ApplicationContext.Provider value={this.state}>{children}</ApplicationContext.Provider>;
  }
}

export const withApplication = (Component: React.ComponentType<any>) => (props: any) =>
  <ApplicationContext.Consumer>{(store) => <Component app={store} {...props} />}</ApplicationContext.Consumer>;
