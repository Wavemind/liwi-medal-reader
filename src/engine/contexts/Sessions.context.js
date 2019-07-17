// @flow
/* eslint-disable react/no-unused-state*/
import * as React from 'react';
import { Toaster } from '../../utils/CustomToast';
import { destroySession, getSession, getSessions, setSessions, updateSession } from '../api/LocalStorage';
import { auth, fetchAlgorithms } from '../../../frontend_service/api/Http';
import i18n from '../../utils/i18n';

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

export class SessionsProvider extends React.Component<SessionsProviderProps,
  SessionsProviderState> {
  constructor(props: SessionsProviderProps) {
    super(props);
    this.initContext();
  }

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
      const credentials = await auth(email, password).catch(error => {
        reject(error);
      });


      if (credentials.success !== false || credentials.success === undefined) {
        let sessions = await getSessions();
        if (sessions === null) {
          sessions = [];
        }
        if (Array.isArray(sessions)) {
          const user = sessions.find((session) => {
            return session.data.id === credentials.data.id;
          });

          if (!user || user.local_code === undefined) {
            sessions.push(credentials);
            await setSessions(sessions);
            this.setState({ sessions });


            return fetchAlgorithms(credentials.data.id)
              .then(async () => {
                resolve(credentials);
              })
              .catch((err) => {
                reject(err);
              });
          }

          Toaster(i18n.t('notifications.session_already_exist'), { type: 'danger' });
          reject('Already connected');
        }
      }
    });
  };

  render() {
    const { children } = this.props;
    return (
      <SessionsContext.Provider value={this.state}>
        {children}
      </SessionsContext.Provider>
    );
  }
}

export const withSessions = (Component: React.ComponentType<any>) => (
  props: any,
) => (
  <SessionsContext.Consumer>
    {(store) => <Component sessions={store} {...props} />}
  </SessionsContext.Consumer>
);
