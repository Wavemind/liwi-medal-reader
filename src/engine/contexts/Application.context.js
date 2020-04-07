// @flow
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { sha256 } from 'js-sha256';
import { NavigationScreenProps } from 'react-navigation';
import { AppState, PermissionsAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';

import { destroySession, getItem, getSession, setActiveSession, setItem } from '../api/LocalStorage';
import NavigationService from '../navigation/Navigation.service';
import { appInBackgroundStateKey, saltHash } from '../../../frontend_service/constants';
import { fetchAlgorithms } from '../../../frontend_service/api/Http';

import i18n from '../../utils/i18n';
import sessionJson from '../../../frontend_service/api/session';
import Toast from 'react-native-tiny-toast';
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
    this.initializeAsync();
  }

  initializeAsync = async () => {
    await this.initContext();

    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.addEventListener('connectionChange', this._handleConnectivityChange);
  };

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
    return Geolocation.getCurrentPosition(
      async (position) => callBack(position),
      async (error) => callBack(error),
      {
        enableHighAccuracy,
        timeout: 5000,
      }
    );
  };

  // Set value in context
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  // Log out
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
    const session = await getItem('session');
    const user = await getItem('user');
    if (session !== null) {
      this.setUserContext(session, user);
    } else {
      this.setState({ ready: true });
    }
  };

  // Set user context
  setUserContext = (session, user = null) => {
    this.setState({
      session,
      user,
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
    this.setState({
      logged: false,
      user: null,
    });
  };

  setModal = async (content) => {
    this.setState({
      isModalVisible: true,
      contentModal: content,
    });
  };

  getGroupData = async () => {
    const session = await getItem('session');

    // let group = await auth(session).catch((error) => {
    //   return error;
    // });

    await setTimeout(async () => {
      const group = {
        passwordLength: 4,
        token: '123456789oiukjfdewtzujk',
        pinCode: 1234,
        name: 'Centre Médical Katboundou',
        users: [
          { id: 1, lastname: 'Steve', surname: 'Jacques', role: 'Clinician', preFix: 'Dr.' },
          { id: 2, lastname: 'Bryan', surname: 'Druker', role: 'Lab', preFix: 'Mr.' },
          { id: 5, lastname: 'Marie-Ange', surname: 'Briault', role: 'Nurse', preFix: 'Mrs.' },
          { id: 6, lastname: 'Vincent', surname: 'Other name', role: 'Nurse', preFix: 'Mrs.' },
        ],
      };

      if (group !== false) {
        await setItem('session', { ...session, group });
        this.setState({ session: { ...session, group } });
        this.showSuccessToast('Receiving group data and users');
        return true;
      }
    }, 5000);
  };

  openSession = async (pinCode) => {
    const { session, user } = this.state;
    if (session.group.pinCode === Number(pinCode)) {
      this.showSuccessToast('Successful connect to your group');

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
    } else {
      return false;
    }
  };

  setUser = async (user) => {
    await setItem('user', user);
    this.setState({ user, logged: true });
  };

  showSuccessToast = (msg) => {
    Toast.showSuccess(msg, {
      position: 20,
      containerStyle: { backgroundColor: liwiColors.greenColor },
      textStyle: { color: liwiColors.whiteColor },
      imgStyle: { height: 40 },
    });
  };

  // Create new session
  newSession = async (email: string, password: string) => {
    // let credentials = await auth(email, password).catch((error) => {
    //   return error;
    // });

    let credentials = sessionJson;

    if (credentials !== false) {
      let concatSession = { group: null, ...credentials };
      await setItem('session', concatSession);
      this.showSuccessToast('Successful tablet identification');
      return true;
    }

    return false;
  };

  state = {
    name: 'App',
    lang: 'fr',
    set: this.setValState,
    logged: false,
    initContext: this.initContext,
    setUser: this.setUser,
    logout: this.logout,
    getGroupData: this.getGroupData,
    unLockSession: this.unLockSession,
    openSession: this.openSession,
    lockSession: this.lockSession,
    newSession: this.newSession,
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
    session: null,
    user: null,
  };

  _fetchDataWhenChange = async () => {
    const { user } = this.state;
    if (!isEmpty(user) && user?.data?.id) {
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
    const permissionReturned = await this.getGeo();
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

export const withApplication = (Component: React.ComponentType<any>) => (props: any) => <ApplicationContext.Consumer>{(store) => <Component app={store} {...props} />}</ApplicationContext.Consumer>;
