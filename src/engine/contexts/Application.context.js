// @flow
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import find from 'lodash/find';
import { fetchAlgorithms } from '../../../frontend_service/api/Http';
import { sha256 } from 'js-sha256';
import { saltHash } from '../../../frontend_service/constants';
import { Toaster } from '../../utils/CustomToast';
import { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { sessionsDuration } from '../../utils/constants';
import isEmpty from 'lodash/isEmpty';

import NavigationService from '../navigation/Navigation.service';

import {
  destroySession,
  getItem,
  getSession,
  getSessions,
  SetActiveSession,
  setItem,
  setSessions, updateSession,
} from '../api/LocalStorage';
import { AppState, NetInfo, PermissionsAndroid } from 'react-native';
import i18n from '../../utils/i18n';

const defaultValue = {};
export const ApplicationContext = React.createContext<Object>(defaultValue);

type Props = NavigationScreenProps & {
  children: React.Node,
};

type State = {
  name: string,
  lang: string,
  set: (prop: any, value: any) => Promise<any>,
  initContext: () => Promise<any>,
  logged: boolean,
  user: Object,
  logout: () => Promise<any>,
  unlockSession: (id: number, code: string) => Promise<any>,
  lockSession: () => Promise<any>,
  isConnected: string,
  medicalCase: Object,
};

export class ApplicationProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.initContext();
  }

  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

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
    NetInfo.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // If the app is active or not
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('---> Liwi is come back from background', nextAppState);
      this._fetchDataWhenChange();
      this.setState({ appState: nextAppState });
    }

    if (
      this.state.appState.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      console.log('---> Liwi is hidding');
      this.setState({ appState: nextAppState });
    }
  };

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

  getGeo = async () => {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: i18n.t('popup:title'),
        message: i18n.t('popup:message'),
        buttonNeutral: i18n.t('popup:askmelater'),
        buttonNegative: i18n.t('popup:cancel'),
        buttonPositive: 'Ok !',
      }
    );
  };

  askGeo = async (enableHighAccuracy, callBack) => {
    return navigator.geolocation.getCurrentPosition(
      async (position) => callBack(position),
      async (error) => callBack(error),
      {
        enableHighAccuracy: enableHighAccuracy,
        timeout: 5000,
      }
    );
  };

  // Set value in context
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  // Log out
  // TODO : check if duplicated from Session context is really necessary
  logout = async () => {
    await destroySession(this.state.user.data.id);
    this.setState({
      user: {},
      logged: false,
    });
  };

  // Load context of current user
  initContext = async () => {
    const sessions = await getSessions();
    let finderActiveSession = find(sessions, (session) => {
      const isStillActive = moment().isBefore(
        moment(session.active_since).add(sessionsDuration, 'minute')
      );
      return session.active && isStillActive;
    });

    if (finderActiveSession) {
      this.setUserContext(finderActiveSession);
      this.pushSettings(finderActiveSession);
    }
  };

  // Set user context
  setUserContext = (userData) => {
    this.setState({
      logged: true,
      user: userData,
    });
  };

  // Set medical case in context
  setMedicalCase = (medicalCase) => {
    this.setState({ medicalCase });
  };

  pushSettings = async (session) => {
    let { lastLogin } = session;


    console.log(lastLogin, session)
    let now = moment();
    let lastLoginMoment;

    if (lastLogin !== undefined) {
      lastLoginMoment = moment(lastLogin);
    }

    if (lastLogin === undefined || now() > lastLoginMoment) {
      NavigationService.navigate('Settings', { userName: 'Lucy' });
      session.lastLogin = now.toString();
      await updateSession(session.data.id, session);
    }
  };

  // Unlock session from local credentials
  unlockSession = async (id: number, code: string) => {
    let session = await getSession(id);
    const encrypt = sha256.hmac(saltHash, code);

    if (session.local_code === encrypt) {
      await SetActiveSession(id);

      await fetchAlgorithms(id);

      session = await getSession(id);
      this.setUserContext(session);

      console.log(session);

      this.pushSettings(session);

      // here push settings
    } else {
      Toaster('Pas le bon code', { type: 'danger' });
    }
  };

  // Lock current session
  lockSession = async () => {
    SetActiveSession();
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
    createMedicalCase: this.createMedicalCase,
    user: {},
    logout: this.logout,
    unlockSession: this.unlockSession,
    lockSession: this.lockSession,
    isConnected: true,
    setMedicalCase: this.setMedicalCase,
    medicalCase: {},
    appState: AppState.currentState,
    setModal: this.setModal,
    isModalVisible: false,
    contentModal: 'initial',
    initialPosition: {},
  };

  render() {
    const { children } = this.props;

    return (
      <ApplicationContext.Provider value={this.state}>
        {children}
      </ApplicationContext.Provider>
    );
  }
}

export const withApplication = (Component: React.ComponentType<any>) => (
  props: any
) => (
  <ApplicationContext.Consumer>
    {(store) => <Component app={store} {...props} />}
  </ApplicationContext.Consumer>
);
