// @flow
/* eslint-disable react/no-unused-state */

import * as React from 'react';

import {
  getSessions,
  updateSession,
  getSession,
  setSessions,
  destroySession,
} from '../api/LocalStorage';

import { auth, fetchAlgorithmes } from '../api/Http';
import { ToastFactory } from 'utils/ToastFactory';
import { get } from 'engine/api/Http';

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
  deconnexion: (userId: number) => Promise<any>,
};

export class SessionsProvider extends React.Component<
  SessionsProviderProps,
  SessionsProviderState
> {
  setValState = async (prop: any, value: any) => {
    await this.setState({ [prop]: value });
  };

  constructor(props: SessionsProviderProps) {
    super(props);

    this.initContext();
  }

  deconnexion = async (userId: number) => {
    await destroySession(userId);
    await this.initContext();
  };

  initContext = async () => {
    const sessions = await getSessions();
    this.setState({ sessions });
  };

  setLocalCode = async (encrypted: string, userId: number) => {
    const session = await getSession(userId);
    session.local_code = encrypted;
    await updateSession(userId, session);
  };

  newSession = async (email: string, password: string) => {
    const credentials = await auth(email, password);
    if (credentials.success !== false || credentials.success === undefined) {
      let sessions = await getSessions();
      if (sessions === null) {
        sessions = [];
      }
      if (Array.isArray(sessions)) {
        const exist = sessions.find((session) => {
          return session.data.id === credentials.data.id;
        });
        if (!exist) {
          sessions.push(credentials);
          await setSessions(sessions);
          this.setState({ sessions });
          return fetchAlgorithmes(credentials.data.id)
            .then(async (done) => {
              return credentials;
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        ToastFactory('Already connected', { type: 'danger' });
      }
    }
    return false;
  };

  state = {
    set: this.setValState,
    initContext: this.initContext,
    newSession: this.newSession,
    sessions: [],
    setLocalCode: this.setLocalCode,
    deconnexion: this.deconnexion,
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
  props: any
) => (
  <SessionsContext.Consumer>
    {(store) => <Component sessions={store} {...props} />}
  </SessionsContext.Consumer>
);
