// @flow
import * as React from 'react';
import * as NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { NavigationScreenProps } from 'react-navigation';
import { AppState, PermissionsAndroid } from 'react-native';

import i18n from '../../utils/i18n';
import NavigationService from '../navigation/Navigation.service';
import Database from '../api/Database';
import { appInBackgroundStateKey, secondStatusLocalData } from '../../../frontend_service/constants';
import { auth, fetchAlgorithms, get, post } from '../../../frontend_service/api/Http';
import { getDeviceInformation } from '../api/Device';
import { displayNotification } from '../../utils/CustomToast';
import { getItem, setItem } from '../api/LocalStorage';
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
   * @private
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

  /**
   * Ask user to allow access to location
   * @returns {Promise<*>}
   * @private
   */
  _askGeo = async () => {
    const { t } = this.state;
    return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: t('popup:title'),
      message: t('popup:message'),
      buttonNeutral: t('popup:ask_me_later'),
      buttonNegative: t('popup:cancel'),
      buttonPositive: 'Ok !',
    });
  };

  /**
   * Get geolocalization
   * @param enableHighAccuracy
   * @param callBack
   * @returns {Promise<void>}
   * @private
   */
  _getGeo = async (enableHighAccuracy, callBack) => {
    return Geolocation.getCurrentPosition(
      async (position) => callBack(position),
      async (error) => callBack(error),
      {
        enableHighAccuracy,
        timeout: 5000,
      },
    );
  };

  /**
   * Set value in context state
   * @param {any} prop - Key to update in state
   * @param {any} value - Value to set in state
   * @returns {Promise<void>}
   */
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  // TODO: Check useness of this method and lockSession method
  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout = async () => {
    await setItem('user', null);
    this.setState({
      user: null,
      logged: false,
    });
  };

  // TODO: Check useness of this method and logout method
  /**
   * Lock session
   * @returns {Promise<void>}
   */
  lockSession = async () => {
    this.setState({
      logged: false,
      user: null,
    });
  };

  /**
   * Display modal and set content
   * @param {any} content - What will be displayed
   * @returns {Promise<void>}
   */
  setModal = async (content) => {
    this.setState({
      isModalVisible: true,
      contentModal: content,
    });
  };

  /**
   * Fetch group info from medal-c
   * @param { boolean } showToast - Display a notification
   * @returns {Promise<boolean>}
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
        showToast ? displayNotification(t('notifications:get_group'), liwiColors.greenColor) : null;
        return true;
      } else {
        displayNotification(group.errors, liwiColors.redColor);
      }
    }

    return false;
  };

  /**
   * Get the pin code from screen
   * Redirect to userSelection if not opened
   * Redirect to home if already opened
   * @params { string }: pinCode : pin code from screen
   * @return boolean
   */
  openSession = async (pinCode) => {
    const { session, user, t } = this.state;
    if (session.group.pin_code === pinCode) {
      displayNotification(t('notifications:connection_successful'), liwiColors.greenColor);

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

  /**
   * Store user in state context and local storage
   * @param { object } user - User to store
   * @returns {Promise<void>}
   */
  setUser = async (user) => {
    await setItem('user', user);
    this.setState({ user, logged: true });
  };

  /**
   * Authenticate user and then register device in medal-c
   * @param { string } email - User email
   * @param { string } password - User password
   * @returns {Promise<boolean>}
   */
  newSession = async (email: string, password: string) => {
    const { t } = this.state;

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
        displayNotification(t('notifications:device_registered'), liwiColors.greenColor);
        return true;
      }
    }
    return false;
  };

  state = {
    appState: AppState.currentState,
    contentModal: 'initial',
    currentRoute: null,
    initialPosition: {},
    isModalVisible: false,
    isConnected: false,
    lang: 'fr',
    logged: false,
    name: 'App',
    medicalCase: {},
    ready: false,
    session: null,
    user: null,
    getGroupData: this.getGroupData,
    logout: this.logout,
    lockSession: this.lockSession,
    newSession: this.newSession,
    openSession: this.openSession,
    set: this.setValState,
    subscribePingApplicationServer: this.subscribePingApplicationServer,
    setModal: this.setModal,
    setUser: this.setUser,
    t: (translate) => i18n.t(translate),
  };

  async componentDidMount() {
    const permissionReturned = await this._askGeo(); // keep
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
      await this._getGeo(true, async (cb) => {
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

  /**
   * Set new state when closing the app
   * @param { object } nextAppState - Next state
   * @returns {Promise<void>}
   * @private
   */
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
