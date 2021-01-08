// @flow
import * as React from 'react';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { AppState, PermissionsAndroid } from 'react-native';

import { NetworkConsumer, NetworkProvider } from 'react-native-offline';
import i18n from '../../utils/i18n';
import { secondStatusLocalData, modalType } from '../../../frontend_service/constants';
import { auth, getAlgorithm, getFacility, registerDevice } from '../../../frontend_service/api/Http';
import { getItem, setItem } from '../api/LocalStorage';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';
import { displayNotification } from '../../utils/CustomToast';
import { liwiColors } from '../../utils/constants';
import { store } from '../../../frontend_service/store';
import NavigationService from '../navigation/Navigation.service';

const defaultValue = {};

export const ApplicationContext = React.createContext<Object>(defaultValue);

export class ApplicationProvider extends React.Component {
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
    if (session !== null && session?.facility !== null) {
      const user = await getItem('user');
      this.setState({
        session,
        user,
        ready: true,
      });
    } else {
      this.setState({
        ready: true,
      });
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  };

  /**
   * Ask user to allow access to location
   * @returns {Promise<*>}
   * @private
   */
  _askGeo = async () => {
    const { t } = this.state;
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: t('popup:title'),
      message: t('popup:message'),
      buttonNeutral: t('popup:ask_me_later'),
      buttonNegative: t('popup:cancel'),
      buttonPositive: t('popup:ok'),
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
      }
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

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout = async () => {
    NavigationService.navigate('UnlockSession', {});
    await setItem('user', null);
    this.setState({
      user: null,
      logged: false,
    });
  };

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

  getFacility = async () => {
    const facility = await getFacility();
    const session = await getItem('session');
    await setItem('session', { ...session, facility });
    this.setState({ session: { ...session, facility } });
    return facility;
  };

  /**
   * Fetch group and algorithm from medAL-creator
   * @returns {Promise<boolean>}
   */
  setInitialData = async () => {
    const facility = await this.getFacility();
    const algorithm = await getItem('algorithm');
    let newAlgorithm;

    if (facility !== null) {
      newAlgorithm = await getAlgorithm(algorithm?.json_version);

      if (newAlgorithm !== null) {
        newAlgorithm.selected = true;

        // Update popup only if version has changed
        if (newAlgorithm.version_id !== algorithm.version_id) {
          store.dispatch(
            updateModalFromRedux(
              {
                title: i18n.t('popup:version'),
                version_name: newAlgorithm.version_name,
                author: newAlgorithm.author,
                description: newAlgorithm.description,
              },
              modalType.algorithmVersion
            )
          );
        }

        await setItem('algorithm', JSON.parse(JSON.stringify(newAlgorithm)));
      } else {
        newAlgorithm = algorithm;
      }
      this.setState({ filtersPatient: {}, filtersMedicalCase: {}, algorithm: newAlgorithm });
    }

    if (facility.architecture === 'standalone') {
      await setItem('isConnected', false);
    }

    return facility;
  };

  /**
   * Store user in state context and local storage
   * @param { object } user - User to store
   * @returns {Promise<void>}
   */
  setUser = async (user) => {
    await setItem('user', user);
    this.setState({ user, logged: true });
    NavigationService.navigate('App');
  };

  /**
   * Authenticate user and then register device in medAL-creator
   * @param { string } email - User email
   * @param { string } password - User password
   * @returns {Promise<boolean>}
   */
  newSession = async (email: string, password: string) => {
    const { t } = this.state;
    const session = await auth(email, password);

    // if no error set the tablet
    if (session?.success !== false) {
      const concatSession = { facility: null, ...session };
      // Set item in localstorage
      await setItem('session', concatSession);
      const register = await registerDevice();

      if (register === true) {
        // Show toast
        displayNotification(t('notifications:device_registered'), liwiColors.greenColor);
        return true;
      }
    }
    return false;
  };

  /**
   * Check if action is available depending on architecture and connection status
   * @returns {boolean}
   */
  isActionAvailable = () => {
    const { isConnected, session } = this.state;

    if (session.facility.architecture === 'client_server') {
      return isConnected;
    }

    return true;
  };

  state = {
    appState: AppState.currentState,
    currentRoute: null,
    initialPosition: {},
    isConnected: false,
    filtersPatient: {},
    filtersMedicalCase: {},
    environment: 'production',
    lang: 'fr',
    logged: false,
    name: 'App',
    session: null,
    medicalCase: {},
    ready: false,
    user: null,
    setInitialData: this.setInitialData,
    isActionAvailable: this.isActionAvailable,
    logout: this.logout,
    lockSession: this.lockSession,
    newSession: this.newSession,
    set: this.setValState,
    setUser: this.setUser,
    showPinOnUnlock: true,
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
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  /**
   * Set new state when closing the app
   * @param { object } nextAppState - Next state
   * @returns {Promise<void>}
   * @private
   */
  _handleAppStateChange = async (nextAppState) => {
    const { appState, showPinOnUnlock } = this.state;

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.warn('---> Liwi came back from background', nextAppState);
      if (showPinOnUnlock) {
        this.setState({ appState: nextAppState, logged: false });
        NavigationService.navigate('AuthLoading');
      } else {
        this.setState({ showPinOnUnlock: true });
      }
    }

    if (appState.match(/active/) && nextAppState.match(/inactive|background/)) {
      console.warn('---> Liwi is hiding');
      this.setState({ appState: nextAppState });
    }
  };

  render() {
    const { children } = this.props;
    const { session } = this.state;

    let serverURL = '';
    let isStandalone = false;

    if (session !== null) {
      isStandalone = session.facility.architecture === 'standalone';
      if (!isStandalone) {
        serverURL = session.facility.local_data_ip;
      }
    }

    return (
      <NetworkProvider shouldPing={!isStandalone} pingServerUrl={serverURL} pingInterval={secondStatusLocalData}>
        <NetworkConsumer>{({ isConnected }) => <ApplicationContext.Provider value={{ ...this.state, isConnected }}>{children}</ApplicationContext.Provider>}</NetworkConsumer>
      </NetworkProvider>
    );
  }
}

export const withApplication = (Component: React.ComponentType<any>) => (props: any) => <ApplicationContext.Consumer>{(store) => <Component app={store} {...props} />}</ApplicationContext.Consumer>;
