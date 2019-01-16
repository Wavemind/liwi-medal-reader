import { AsyncStorage } from 'react-native';
import moment from 'moment';
import { get, post } from './Http';
import find from 'lodash/find';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';

export const setCredentials = async (newState) => {
  return await AsyncStorage.setItem('credentials', JSON.stringify(newState));
};

export const destroyCredentials = async () => {
  return await AsyncStorage.removeItem('credentials', (err) => {
    // key 'key' will be removed, if they existed
    // callback to do some action after removal of item
  });
};

//

export const isLogged = async () => {
  let credentiels = await getCredentials();

  if (credentiels === null) {
    return false;
  }

  let date_expiry = new Date(credentiels.expiry * 1000);
  // TODO validate_token
  // if (!moment(date_expiry).isAfter(moment())) {
  //   return await get('auth/validate_token');
  // }

  return moment(date_expiry).isAfter(moment());
};

export const getCredentials = async (user_id) => {
  const credentials = await AsyncStorage.getItem('credentials');
  return JSON.parse(credentials);
};

export const getSessions = async () => {
  const sessions = await AsyncStorage.getItem('sessions');
  const sessionsArray = JSON.parse(sessions);
  if (sessionsArray === null) {
    return [];
  }
  return sessionsArray;
};

export const updateSession = async (id, newState) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    var index = findIndex(sessions, (session) => {
      return session.data.id === id;
    });

    sessions.splice(index, 1, newState);
  }
  await setSessions(sessions);
};

export const clearLocalStorage = async (key) => {
  await AsyncStorage.setItem('sessions', '[]');
};

export const SetActiveSession = async (id = null) => {
  const sessions = await getSessions();
  await sessions.map((session) => {
    if (session.active === undefined || session.active === true) {
      session.active = false;
      session.active_since = false;
    }

    if (session.data.id === id) {
      session.active = true;
      session.active_since = moment().format();
    }
  });

  await setSessions(sessions);
};

export const getSession = async (id) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    let findSession = sessions.find((session) => {
      return session.data.id === id;
    });

    if (findSession === undefined) {
      return { access_token: 'unsecure' };
    }

    return findSession;
  }
  return {};
};

export const setSessions = async (newState) => {
  return await AsyncStorage.setItem('sessions', JSON.stringify(newState));
};

export const destroySession = async (session_id) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    remove(sessions, (session) => session.data.id === session_id);
  }
  await setSessions(sessions);
  return true;
};
