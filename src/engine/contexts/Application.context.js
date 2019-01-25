// @flow
/* eslint-disable react/no-unused-state */

import * as React from 'react';
import {
  createMedicalCase,
  destroySession,
  getSession,
  getSessions,
  SetActiveSession,
} from '../api/LocalStorage';
import find from 'lodash/find';

import { post } from '../api/Http';
import { sha256 } from 'js-sha256';
import { saltHash } from 'utils/constants';
import { ToastFactory } from 'utils/ToastFactory';
import { NavigationScreenProps } from 'react-navigation';
import { NetInfo } from 'react-native';
import { GetDeviceInformations } from '../api/Device';
import moment from 'moment';
import { sessionsDuration } from '../../utils/constants';
import { medicalCaseInitialState } from '../algorithme/medicalCase';

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
};

export class ApplicationProvider extends React.Component<Props, State> {
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  constructor(props: Props) {
    super(props);
    this.initContext();
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done((isConnected) => {
      this.setState({ isConnected });
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleConnectivityChange
    );
  }

  createMedicalCase = async () => {
    const response = await fetch('https://uinames.com/api/?ext');

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

  _handleConnectivityChange = async (isConnected) => {
    this.setState({
      isConnected,
    });

    if (isConnected) {
      await GetDeviceInformations((deviceInfo) => {
        console.log('Internet is back ! POST it ');
        post('connected', deviceInfo);
      });
    }
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
      let isStillActive = moment().isBefore(
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
    const session = await getSession(id);
    const encrypt = sha256.hmac(saltHash, code);

    if (session.local_code === encrypt) {
      await SetActiveSession(id);
      const session = await getSession(id);
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
    isConnected: '',
    setMedicalCase: this.setMedicalCase,
    medicalCase: medicalCaseInitialState,
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
