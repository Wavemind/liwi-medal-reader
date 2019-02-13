import { Alert } from 'react-native';
import { devHost } from 'utils/constants';
import { ErrorHttpFactory, ToastFactory } from 'utils/ToastFactory';
import { getItems, getSession, setItem } from './LocalStorage';
import { GetDeviceInformations } from './Device';
import find from 'lodash/find';

const getHeaders = async (method = 'GET', body = false, userId = null) => {
  const credentials = async () => await getSession(userId);
  return credentials().then((data) => {
    let header = {
      method: method,
      headers: {
        'access-token': data.access_token,
        client: data.client,
        uid: data.uid,
        expiry: data.expiry,
      },
    };
    if (method === 'POST' || method === 'PATCH') {
      header.body = JSON.stringify(body);
      header.headers['Accept'] = 'application/json, text/plain';
      header.headers['Content-Type'] = 'application/json';
    }
    return header;
  });
};

export const get = async (params, userId) => {
  const response = await fetch(
    devHost + '/api/v1/' + params,
    await getHeaders('GET', false, userId)
  ).catch(function(error) {
    // Find how display error
    Alert.alert('Une erreur est survenue. Veuillez réessayer ultérieurement');
    throw error;
  });

  const data = await response;

  if (data.status === 200) {
    const json = await data.json();
    return json;
  }

  if (data.status === 422) {
    const json = await data.json();
    ToastFactory(json);
    return json;
  }

  if (data.status === 401) {
    const json = await data.json();
    ToastFactory(json);
    return json;
  }

  return data;
};

export const post = async (
  params,
  body = {},
  user_id = null,
  method = 'POST'
) => {
  const response = await fetch(
    devHost + '/api/v1/' + params,
    await getHeaders(method, body, user_id)
  ).catch(function(error) {
    // Find how display error
    Alert.alert('Une erreur est survenue. Veuillez réessayer ultérieurement');
    throw error;
  });

  let r = await response;
  return r;
};

export const postDeviceInfo = async () => {
  const device = {};
  const response = await fetch(`${devHost}/api/v1/activities`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  }).catch(function(error) {
    // Find how display error
    Alert.alert('Une erreur est survenue. Veuillez réessayer ultérieurement');
    throw error;
  });

  let r = await response;
  return r;
};

export const auth = async (email, password) => {
  const response = await fetch(`${devHost}/api/v1/auth/sign_in`, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).catch(function(error) {
    // Find how display error
    Alert.alert('Une erreur est survenue. Veuillez réessayer ultérieurement');
    throw error;
  });

  let request = await response;
  let body = await request.json();

  ErrorHttpFactory(request, body);

  return await {
    ...body,
    access_token: await response.headers.get('access-token'),
    client: await response.headers.get('client'),
    expiry: await response.headers.get('expiry'),
    uid: await response.headers.get('uid'),
  };
};

export const fetchAlgorithmes = async (userId) => {
  return new Promise(async (resolve, reject) => {
    await GetDeviceInformations(async (deviceInfo) => {
      console.log('---- fetchAlgorithmes -----');
      deviceInfo.activity.user_id = userId;
      post('activities', deviceInfo, userId);

      let algorithme = await get(
        `algorithm_versions?mac_address=${
          deviceInfo.activity.device_attributes.mac_address
        }`,
        userId
      );

      let localAlgorithmes = await getItems('algorithmes');

      let findAlgo = find(localAlgorithmes, (a) => a.id === algorithme.id);
      let findVersion;

      if (findAlgo !== undefined) {
        // Cet algo est déja en local, on cherche la version
        findVersion = find(
          findAlgo.versions,
          (a) => a.version === algorithme.version
        );

        if (findVersion === undefined) {
          // cette version existe pas encore !!!
          findAlgo.versions.push(algorithme);
        } else {
          findVersion = algorithme;
        }
      } else if (algorithme.id !== undefined) {
        // Cet algo n'existe pas
        localAlgorithmes.push({
          id: algorithme.id,
          name: algorithme.name,
          versions: [algorithme],
        });
      }

      ToastFactory('Algo Updated', { type: 'success' });
      await setItem('algorithmes', localAlgorithmes);
      resolve();
    });
  });
};
