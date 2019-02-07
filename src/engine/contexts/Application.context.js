// @flow
/* eslint-disable react/no-unused-state */

import * as React from 'react';
import {
  createMedicalCase,
  destroySession,
  getSession,
  getSessions,
  SetActiveSession,
  setItem,
} from '../api/LocalStorage';
import find from 'lodash/find';

import { get, post } from '../api/Http';
import { sha256 } from 'js-sha256';
import { saltHash } from 'utils/constants';
import { ToastFactory } from 'utils/ToastFactory';
import { NavigationScreenProps } from 'react-navigation';
import { AppState, NetInfo } from 'react-native';
import { GetDeviceInformations } from '../api/Device';
import moment from 'moment';
import { sessionsDuration } from '../../utils/constants';
import isEmpty from 'lodash/isEmpty';

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
  deconnexion: () => Promise<any>,
  unlockSession: (id: number, code: string) => Promise<any>,
  lockSession: () => Promise<any>,
  isConnected: string,
  medicalCase: Object,
};

export class ApplicationProvider extends React.Component<Props, State> {
  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done((isConnected) => {
      this.setState({ isConnected });
    });
  }
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  constructor(props: Props) {
    super(props);
    this.initContext();
  }

  componentWillUnmount() {
    // TODO twice call ?
    NetInfo.isConnected.removeEventListener(
      'change',
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
      console.log('App has come to the foreground!', nextAppState);
      this._fetchDataWhenChange();
      this.setState({ appState: nextAppState });
    }
  };

  _fetchDataWhenChange = async () => {
    const { user } = this.state;
    if (!isEmpty(user)) {
      let algorithmes = await get('algorithm_versions', user.data.id);

      // TODO shitty workaround from backend developpers
      await algorithmes.map((algorithme, index) => {
        algorithmes[index].json = JSON.parse(algorithme.json);
      });
      await setItem('algorithmes', algorithmes);

      await GetDeviceInformations((deviceInfo) => {
        console.log('Internet is back ! POST it ');
        post('activites', deviceInfo, user.data.id);
      });
    }
  };

  _handleConnectivityChange = async (isConnected) => {
    this.setState({
      isConnected,
    });

    if (isConnected) {
      await this._fetchDataWhenChange();
    }
  };

  createMedicalCase = async () => {
    const response = await fetch('https://uinames.com/api/?ext&region=france');

    const json = await response.json();
    createMedicalCase({
      ...this.state.medicalCase,
      userId: this.state.user.data.id,
      patient: {
        ...this.state.medicalCase.patient,
        lastname: json.name,
        firstname: json.surname,
        birthdate: json.birthday.dmy,
        email: json.email,
        photo: json.photo,
      },
    });
  };

  deconnexion = async () => {
    await destroySession(this.state.user.data.id);
    this.setState({
      user: {},
      logged: false,
    });
  };

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
    }
  };

  setUserContext = (userData) => {
    this.setState({
      logged: true,
      user: userData,
    });
  };

  setMedicalCase = (medicalCase) => {
    this.setState({ medicalCase });
  };

  unlockSession = async (id: number, code: string) => {
    let session = await getSession(id);
    const encrypt = sha256.hmac(saltHash, code);

    if (session.local_code === encrypt) {
      await SetActiveSession(id);
      session = await getSession(id);
      this.setUserContext(session);
    } else {
      ToastFactory('Pas le bon code', { type: 'danger' });
    }
  };

  lockSession = async () => {
    SetActiveSession();
    this.setState({
      logged: false,
      user: {},
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
    deconnexion: this.deconnexion,
    unlockSession: this.unlockSession,
    lockSession: this.lockSession,
    isConnected: true,
    setMedicalCase: this.setMedicalCase,
    medicalCase: {},
    appState: AppState.currentState,
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
