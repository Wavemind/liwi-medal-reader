// @flow
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { sha256 } from 'js-sha256';
import { NavigationScreenProps } from 'react-navigation';
import { AppState, PermissionsAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';

import { sessionsDuration } from '../../utils/constants';

import { destroySession, getSession, getSessions, setActiveSession, setItem } from '../api/LocalStorage';
import { appInBackgroundStateKey, saltHash } from '../../../frontend_service/constants';
import { fetchAlgorithms } from '../../../frontend_service/api/Http';

import i18n from '../../utils/i18n';

const defaultValue = {};
export const ApplicationContext = React.createContext<Object>(defaultValue);

type Props = NavigationScreenProps & {
  children: React.Node,
};

export type StateApplicationContext = {
  name: string,
  lang: string,
  set: (prop: any, value: any) => Promise<any>,
  initContext: () => Promise<any>,
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
  }

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

  askGeo = async (enableHighAccuracy, callBack) => {
    return Geolocation.getCurrentPosition(async (position) => callBack(position), async (error) => callBack(error), {
      enableHighAccuracy,
      timeout: 5000,
    });
  };

  // Set value in context
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  // Log out
  // TODO : check if duplicated from Session context is really necessary
  logout = async () => {
    const { user } = this.state;
    await destroySession(user.data.id);
    this.setState({
      user: {},
      logged: false,
    });
  };

  // Load context of current user
  initContext = async () => {
    const sessions = await getSessions();

    const finderActiveSession = find(sessions, (session) => {
      const isStillActive = moment().isBefore(moment(session.active_since).add(sessionsDuration, 'minute'));
      return session.active && isStillActive;
    });

    if (finderActiveSession) {
      this.setUserContext(finderActiveSession);
    } else {
      this.setState({ ready: true });
    }
  };

  // Set user context
  setUserContext = (userData) => {
    this.setState({
      logged: true,
      user: userData,
      ready: true,
    });
  };

  // Unlock session from local credentials
  unLockSession = async (id: number, code: string) => {
    let session = await getSession(id);
    const encrypt = sha256.hmac(saltHash, code);

    if (code.length === 0) {
      return 'empty_code';
    }

    if (session.local_code === encrypt) {
      await setActiveSession(id);

      const { isConnected } = this.state;

      if (isConnected) await fetchAlgorithms(id);

      session = await getSession(id);

      this.setUserContext(session);

      // here push settings
    } else {
      return 'invalid_code';
    }
  };

  // Lock current session
  lockSession = async () => {
    await setActiveSession();
    this.setState({
      logged: false,
      user: {},
    });
  };

  setModal = async (content) => {
    this.setState({
      isModalVisible: true,
      contentModal: content,
    });
  };

  state = {
    name: 'App',
    lang: 'fr',
    set: this.setValState,
    logged: false,
    initContext: this.initContext,
    user: {},
    logout: this.logout,
    unLockSession: this.unLockSession,
    lockSession: this.lockSession,
    isConnected: true,
    medicalCase: {},
    appState: AppState.currentState,
    setModal: this.setModal,
    isModalVisible: false,
    contentModal: 'initial',
    initialPosition: {},
    t: (translate) => i18n.t(translate),
    ready: false,
    currentRoute: null,
  };
  async componentWillMount() {
    await this.initContext();

    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.addEventListener('connectionChange', this._handleConnectivityChange);
  }
  _fetchDataWhenChange = async () => {
    const { user } = this.state;
    if (!isEmpty(user)) {
      await fetchAlgorithms(user.data.id);
    }
  };

  _handleConnectivityChange = async (isConnected) => {
    if (isConnected.type.match(/wifi|cellular/)) {
      this.setState({
        isConnected: true,
      });
      await this._fetchDataWhenChange();
    } else if (isConnected.type.match(/unknown|none/)) {
      this.setState({
        isConnected: false,
      });
    }
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
    NetInfo.removeEventListener('connectionChange', this._handleConnectivityChange);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // If the app is active or not
  _handleAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.warn('---> Liwi came back from background', nextAppState);
      await setItem(appInBackgroundStateKey, true);

      this._fetchDataWhenChange();
      this.setState({ appState: nextAppState });
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

export const withApplication = (Component: React.ComponentType<any>) => (props: any) => <ApplicationContext.Consumer>{(store) => <Component app={store} {...props} />}</ApplicationContext.Consumer>;
