import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import { host, hostDataServer } from '../constants';
import { getDeviceInformation } from '../../src/engine/api/Device';
import json from '../../frontend_service/api/json';
import { handleHttpError, Toaster } from '../../src/utils/CustomToast';
import { getItem, getItems, getSession, setItem } from '../../src/engine/api/LocalStorage';

// @params [String] params, [Integer] userId
// @return [Json] response from server
// Https GET request
export const get = async (params) => {
  const url = `${host}${params}`;
  const header = await getHeaders('GET', false);

  const request = await fetch(url, header).catch((error) => handleHttpError(error));
  const httpcall = await request;

  if (httpcall.status === 500) {
    const t = await httpcall.text();
    console.warn(t, httpcall);
    Toaster('The server is not responding', { type: 'danger', duration: 4000 });
    return { errors: [] };
  }

  const response = await httpcall.json();

  // Display error
  if (!request.ok) {
    handleHttpError(response.errors);
  }

  return response;
};

export const syncMedicalCases = async (body, userId = null) => {
  const url = `${hostDataServer}${'sync_medical_cases'}`;
  const header = await getHeaders('POST', body, userId);

  const request = await fetch(url, header).catch((error) => handleHttpError(error));

  const http = await request;
  const response = await http.text();
  let json = false;

  try {
    json = JSON.parse(response);
  } catch (err) {
    console.warn(err);
    // handle the error according to your needs
  }

  if (http.status === 200) {
    return json;
  }
  return false;
};

// @params [String] params, [Object] body, [Integer] userId, [String] method
// @return [Object] response from server
// Https POST request
export const post = async (params, body = {}, config = {}) => {
  const url = `${host}${params}`;
  const header = await getHeaders('POST', body, config);

  const request = await fetch(url, header).catch((error) => handleHttpError(error));

  const response = await request.json();

  // Display error
  if (!request.ok) {
    handleHttpError(response.errors);
  }

  if (request.status === 200) {
    return true;
  }
  return false;
};

// @params [String] email, [String] password
// @return [Object] response from server
// Https request for authentication
export const auth = async (email, password) => {
  const url = `${host}auth/sign_in`;

  const request = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).catch((error) => {
    handleHttpError(error);
    if (error instanceof Error) {
      throw { success: false };
    }
  });

  const body = await request.json();
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
export const fetchAlgorithms = async () => {
  return new Promise(async (resolve) => {
    const deviceInfo = await getDeviceInformation();
    const credentials = await getItem('session');
    if (credentials !== null && credentials.group !== null) {
      console.warn('fetch algorithm');

      const serverAlgorithm = await get(`versions?mac_address=${deviceInfo.mac_address}`);

      const localAlgorithms = await getItems('algorithms');

      const algorithm = findIndex(localAlgorithms, (a) => a.algorithm_id === serverAlgorithm.algorithm_id);
      const algorithmSelected = find(localAlgorithms, (a) => a.selected === true);

      if (algorithmSelected !== undefined) {
        algorithmSelected.selected = false;
      }

      if (serverAlgorithm.errors) {
        resolve(serverAlgorithm.errors);
        return null;
      }
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
const getHeaders = async (method = 'GET', body = false, config = {}) => {
  const credentials = await getItem('session');

  if (credentials !== null) {
    const header = {
      method,
      headers: {
        'access-token': credentials.access_token,
        'group-token': credentials?.group?.token,
        client: credentials.client,
        uid: credentials.uid,
        expiry: credentials.expiry,
      },
    };
    if (method === 'POST' || method === 'PATCH') {
      header.body = JSON.stringify(body);
      header.headers.Accept = 'application/json, text/plain';
      header.headers['Content-Type'] = 'application/json';
    }
    return header;
  }

  return null;
};
