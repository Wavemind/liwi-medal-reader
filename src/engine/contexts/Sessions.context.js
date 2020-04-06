// @flow
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import { Toaster } from '../../utils/CustomToast';
import { destroySession, getSession, getSessions, setItem, setSessions, updateSession } from '../api/LocalStorage';
import { auth, fetchAlgorithms } from '../../../frontend_service/api/Http';
import i18n from '../../utils/i18n';
import session from '../../../frontend_service/api/session';

const defaultValue = {};
const SessionsContext = React.createContext<Object>(defaultValue);

type SessionsProviderProps = {
  children: React.Node,
};

export type SessionsProviderState = {
  sessions: [],
  set: (prop: any, value: any) => Promise<any>,
  initContext: () => Promise<any>,
  newSession: (email: string, password: string) => Promise<any>,
  setLocalCode: (encrypted: string, userId: number) => Promise<any>,
  logout: (userId: number) => Promise<any>,
};

export class SessionsProvider extends React.Component<SessionsProviderProps, SessionsProviderState> {
  constructor(props: SessionsProviderProps) {
    super(props);
    this.initContext();
  }

  // Log out
  logout = async (userId: number) => {
    await destroySession(userId);
    await this.initContext();
  };

  // Load context of current user
  initContext = async () => {
    const sessions = await getSessions();
    this.setState({ sessions });
  };

  // Define password on first login
  setLocalCode = async (encrypted: string, userId: number) => {
    const session = await getSession(userId);
    session.local_code = encrypted;
    await updateSession(userId, session);
  };

  // Create new session
  newSession = async (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      // let credentials = await auth(email, password).catch((error) => {
      //   return error;
      // });

      let credentials = session;

      if (credentials.success !== false || credentials.success === undefined) {
        await setItem('session', session);
      }
      // Here if error network http
      reject(credentials);
    });
  };

  state = {
    set: this.setValState,
    initContext: this.initContext,
    newSession: this.newSession,
    sessions: [],
    setLocalCode: this.setLocalCode,
    logout: this.logout,
  };

  // Set value in context
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  render() {
    const { children } = this.props;
    return <SessionsContext.Provider value={this.state}>{children}</SessionsContext.Provider>;
  }
}

export const withSessions = (Component: React.ComponentType<any>) => (props: any) => <SessionsContext.Consumer>{(store) => <Component sessions={store} {...props} />}</SessionsContext.Consumer>;
