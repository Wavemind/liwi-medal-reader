// @flow
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import find from 'lodash/find';
import { fetchAlgorithms } from '../api/Http';
import { sha256 } from 'js-sha256';
import { saltHash } from 'utils/constants';
import { ToastFactory } from 'utils/ToastFactory';
import { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { sessionsDuration } from '../../utils/constants';
import isEmpty from 'lodash/isEmpty';

import {
  createMedicalCase,
  destroySession,
  getSession,
  getSessions,
  SetActiveSession,
} from '../api/LocalStorage';
import {
  AppState,
  NetInfo,
} from 'react-native';

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
      this._handleConnectivityChange,
    );
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange,
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
        moment(session.active_since).add(sessionsDuration, 'minute'),
      );
      return session.active && isStillActive;
    });

    if (finderActiveSession) {
      this.setUserContext(finderActiveSession);
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

  // Unlock session from local credentials
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

  // Lock current session
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
    logout: this.logout,
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
  props: any,
) => (
  <ApplicationContext.Consumer>
    {(store) => <Component app={store} {...props} />}
  </ApplicationContext.Consumer>
);
