import { devHost } from '../../../frontend_service/constants';
import { getDeviceInformation } from '../../../src/engine/api/Device';
import findIndex from 'lodash/findIndex';
import isArray from 'lodash/isArray';
import { ErrorHttpFactory, ToastFactory } from 'utils/ToastFactory';
import {
  getItems,
  getSession,
  setItem,
} from '../../../src/engine/api/LocalStorage';

// TODO: Must split logic of getDeviceInformation

// @params [String] method, [Object] body, [Integer] userId
// @return [Object] header
// Set header credentials to communicate with server
const getHeaders = async (method = 'GET', body = false, userId = null) => {
  const credentials = async () => await getSession(userId);
  return credentials().then((data) => {
    let header;
    header = {
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

// @params [String] params, [Integer] userId
// @return [Json] response from server
// Https GET request
export const get = async (params, userId) => {
  const response = await fetch(
    devHost + '/api/v1/' + params,
    await getHeaders('GET', false, userId)
  ).catch(function(error) {
    ToastFactory('Une erreur est survenue. Veuillez réessayer ultérieurement', {
      type: 'danger',
    });
    console.log(error);
  });

  const httpResponse = await response;


  let jsonResponse = await httpResponse.json();


  if (httpResponse.status === 200) {
    return jsonResponse;
  } else if (httpResponse.status === 422 || httpResponse.status === 401) {
    // Throw error and display it
    if (isArray(jsonResponse.errors)) {
      ToastFactory(jsonResponse.errors[0], { type: 'danger' });
    } else {
      ToastFactory(jsonResponse.errors, { type: 'danger' });
    }
    return jsonResponse;
  } else {
    // Unhandled https status return empty json and throw a basic message
    ToastFactory('Unhandled error', { type: 'danger' });
    return {};
  }
};

// @params [String] params, [Object] body, [Integer] userId, [String] method
// @return [Object] response from server
// Https POST request
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
    ToastFactory('Une erreur est survenue. Veuillez réessayer ultérieurement', {
      type: 'danger',
    });
    console.log(error);
  });

  return await response;
};

// @return [Object] response from server
// Send device activity to server
export const postDeviceInfo = async () => {
  const device = {};
  const request = await fetch(`${devHost}/api/v1/activities`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  }).catch(function(error) {
    ToastFactory('Une erreur est survenue. Veuillez réessayer ultérieurement', {
      type: 'danger',
    });
    console.log(error);
  });

  return await request;
};

// @params [String] email, [String] password
// @return [Object] response from server
// Https request for authentication
export const auth = async (email, password) => {
  const request = await fetch(`${devHost}/api/v1/auth/sign_in`, {
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
    ToastFactory('Une erreur est survenue. Veuillez réessayer ultérieurement', {
      type: 'danger',
    });
    console.log(error);
  });

  let response = await request;
  let body = await response.json();

  // Display toast if server return an error
  if (response.status !== 200) {
    ErrorHttpFactory(response, body);
  }

  return await {
    ...body,
    access_token: await request.headers.get('access-token'),
    client: await request.headers.get('client'),
    expiry: await request.headers.get('expiry'),
    uid: await request.headers.get('uid'),
  };
};

// @params [Integer] userId
// Promise fetch algorithm from server
export const fetchAlgorithms = async (userId) => {
  return new Promise(async (resolve, reject) => {
    await getDeviceInformation(async (deviceInfo) => {
      if (deviceInfo === false) {
        reject('Autorisations nécessaire');
      }

      console.log('---- fetchAlgorithms -----');

      deviceInfo.activity.user_id = userId;

      // Send activity from device
      post('activities', deviceInfo, userId);

      let serverAlgorithm = await get(
        `versions?mac_address=${
          deviceInfo.activity.device_attributes.mac_address
        }`,
        userId
      );

      let localAlgorithms = await getItems('algorithms');

      let algorithm = findIndex(localAlgorithms, (a) => a.algorithm_id === serverAlgorithm.algorithm_id);

      if (serverAlgorithm.errors) {
        resolve(serverAlgorithm.errors);
        return null;

      } else {
        if (algorithm !== -1) {
          // Algorithm container already in local, replace this local algo
          localAlgorithms[algorithm] = serverAlgorithm;
        } else {
          // Algorithm not existing in local, push it
          localAlgorithms.push(serverAlgorithm);
        }

        ToastFactory('Algo Updated', { type: 'success' });
        await setItem('algorithms', localAlgorithms);
        resolve();
      }
    });
  });
};
