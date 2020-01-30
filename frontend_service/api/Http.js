import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import { host, hostDataServer } from '../constants';
import { getDeviceInformation } from '../../src/engine/api/Device';

import { handleHttpError, Toaster } from '../../src/utils/CustomToast';
import { getItems, getSession, setItem } from '../../src/engine/api/LocalStorage';

// @params [String] params, [Integer] userId
// @return [Json] response from server
// Https GET request
export const get = async (params, userId) => {
  let url = `${host}${params}`;
  let header = await getHeaders('GET', false, userId);

  const request = await fetch(url, header).catch((error) => handleHttpError(error));
  let httpcall = await request;

  if (httpcall.status === 500) {
    let t = await httpcall.text();
    console.error(t, httpcall);
    Toaster('The server is not responding', { type: 'danger', duration: 4000 });
    return { errors: [] };
  } else {
    let response = await httpcall.json();

    // Display error
    if (!request.ok) {
      handleHttpError(response.errors);
    }

    return response;
  }
};

export const syncMedicalCases = async (body, userId = null) => {
  let url = `${hostDataServer}${'sync_medical_cases'}`;
  let header = await getHeaders('POST', body, userId);

  const request = await fetch(url, header).catch((error) => handleHttpError(error));

  let http = await request;
  let response = await http.text();
  let json = false;

  try {
    json = JSON.parse(response);
  } catch (err) {
    console.warn(err);
    // handle the error according to your needs
  }

  if (http.status === 200) {
    return json;
  } else {
    return false;
  }
};

// @params [String] params, [Object] body, [Integer] userId, [String] method
// @return [Object] response from server
// Https POST request
export const post = async (params, body = {}, userId = null) => {
  let url = `${host}${params}`;
  let header = await getHeaders('POST', body, userId);

  const request = await fetch(url, header).catch((error) => handleHttpError(error));

  let response = await request.json();

  // Display error
  if (!request.ok) {
    handleHttpError(response.errors);
  }

  if (request.status === 200) {
    return true;
  } else {
    return false;
  }
};

// @params [String] email, [String] password
// @return [Object] response from server
// Https request for authentication
export const auth = async (email, password) => {
  let url = `${host}auth/sign_in`;

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
  }).catch((error) => {
    handleHttpError(error);
    if (error instanceof Error) {
      throw { success: false };
    }
  });

  let body = await request.json();
  // Display error
  if (!request.ok) {
    handleHttpError(body.errors);
    throw body;
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
  return new Promise(async (resolve) => {
    let deviceInfo = await getDeviceInformation();

    deviceInfo.activity.user_id = userId;

    await post('activities', deviceInfo);

    let serverAlgorithm = await get(`versions?mac_address=${deviceInfo.activity.device_attributes.mac_address}`, userId);

    let localAlgorithms = await getItems('algorithms');

    let algorithm = findIndex(localAlgorithms, (a) => a.algorithm_id === serverAlgorithm.algorithm_id);
    let algorithmSelected = find(localAlgorithms, (a) => a.selected === true);

    if (algorithmSelected !== undefined) {
      algorithmSelected.selected = false;
    }

    if (serverAlgorithm.errors) {
      resolve(serverAlgorithm.errors);
      return null;
    } else {
      if (algorithm !== -1) {
        // Algorithm container already in local, replace this local algo
        localAlgorithms[algorithm] = serverAlgorithm;
        localAlgorithms[algorithm].selected = true;
      } else {
        // Algorithm not existing in local, push it
        serverAlgorithm.selected = true;
        localAlgorithms.push(serverAlgorithm);
      }

      await setItem('algorithms', localAlgorithms);
      resolve('finish');
    }
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
