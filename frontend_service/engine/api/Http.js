import { host } from '../../../frontend_service/constants';
import { getDeviceInformation } from '../../../src/engine/api/Device';
import find from 'lodash/find';
import { handleHttpError } from 'utils/Error';
import {
  getItems,
  getSession,
  setItem,
} from '../../../src/engine/api/LocalStorage';

// @params [String] params, [Integer] userId
// @return [Json] response from server
// Https GET request
export const get = async (params, userId) => {
  let url = `${host}/api/v1/${params}`;
  let header = await getHeaders('GET', false, userId);

  const request = await fetch(url, header).catch(error => handleHttpError(error));
  let response = await request.json();

  // Display error
  if (!request.ok) {
    handleHttpError(response.errors);
  }

  return response;
};


// @params [String] params, [Object] body, [Integer] userId, [String] method
// @return [Object] response from server
// Https POST request
export const post = async (params, body = {}, userId = null) => {
  let url =  `${host}/api/v1/${params}`;
  let header = await getHeaders('POST', body, userId);

  const request = await fetch(url, header).catch(error => handleHttpError(error));
  let response = await request.json();

  // Display error
  if (!request.ok) {
    handleHttpError(response.errors);
  }

  return response;
};

// @params [String] email, [String] password
// @return [Object] response from server
// Https request for authentication
export const auth = async (email, password) => {
  let url = `${host}/api/v1/auth/sign_in`;

  const request = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).catch(error => handleHttpError(error));

  let body = await request.json();

  // Display error
  if (!request.ok) {
    handleHttpError(body.errors);
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

      let serverAlgorithm = await get(`versions?mac_address=${deviceInfo.activity.device_attributes.mac_address}`, userId);
      let localAlgorithms = await getItems('algorithms');

      // Stop promise if http request return an error
      if (serverAlgorithm.errors) {
        resolve(serverAlgorithm.errors);
        return null;
      } else {
        // Send activity from device
        post('activities', deviceInfo, userId);

        let algorithm = find(localAlgorithms, (a) => a.id === serverAlgorithm.id);
        let version;

        // Algorithm container already in local, checking if the version is new
        if (algorithm !== undefined) {
          version = find(
            algorithm.versions,
            (a) => a.version === serverAlgorithm.version,
          );

          // New version available, push it in local
          if (version === undefined) {
            algorithm.versions.push(serverAlgorithm);
          }
        } else if (serverAlgorithm.id !== undefined) {
          // Algorithm container not existing in local, getting the container and the available version
          localAlgorithms.push({
            id: serverAlgorithm.id,
            name: serverAlgorithm.name,
            versions: [serverAlgorithm],
          });
        }

        await setItem('algorithms', localAlgorithms);
        resolve();
      }
    });
  });
};

// @params [String] method, [Object] body, [Integer] userId
// @return [Object] header
// Set header credentials to communicate with server
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
