// @flow
/* eslint-disable react/no-unused-state */

import * as React from 'react';
import {
  getCredentials,
  getSession,
  isLogged,
  destroySession,
  setCredentials,
} from '../api/LocalStorage';

import { auth } from 'engine/api/Http';
import { sha256 } from 'js-sha256';
import { saltHash } from 'utils/constants';
import { ToastFactory } from 'utils/ToastFactory';
import { NavigationScreenProps } from 'react-navigation';
import { NetInfo } from 'react-native';

const defaultValue = {};
const ApplicationContext = React.createContext<Object>(defaultValue);

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

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  };

  deconnexion = async () => {
    await destroySession(this.state.user.id);
    this.setState({
      user: {},
      logged: false,
    });
  };

  initContext = async () => {};

  unlockSession = async (id: number, code: string) => {
    const session = await getSession(id);
    const encrypt = sha256.hmac(saltHash, code);

    if (session.local_code === encrypt) {
      this.setState({
        logged: true,
        user: session.data,
      });
    } else {
      ToastFactory('Pas le bon code', { type: 'danger' });
    }
  };

  lockSession = async () => {
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
    user: {},
    deconnexion: this.deconnexion,
    unlockSession: this.unlockSession,
    lockSession: this.lockSession,
    isConnected: '',
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
