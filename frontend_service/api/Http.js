import { host, hostDataServer } from '../constants';
import { getDeviceInformation } from '../../src/engine/api/Device';
import { handleHttpError } from '../../src/utils/CustomToast';
import { getItem } from '../../src/engine/api/LocalStorage';

/**
 * Get group configuration by device mac address
 * @returns {Promise<string|Array>}
 */
export const getGroup = async () => {
  const deviceInfo = await getDeviceInformation();
  const url = `${host}devices/${deviceInfo.mac_address}`;
  const header = await _setHeaders();
  return _fetch(url, header);
};

/**
 * Get an algorithm attached to the group
 * @returns {Promise<string|Array>}
 */
export const getAlgorithm = async () => {
  const deviceInfo = await getDeviceInformation();
  const url = `${host}versions?mac_address=${deviceInfo.mac_address}`;
  const header = await _setHeaders();
  return _fetch(url, header);
};

/**
 * Auth user to medal-c
 * @param { string } email - User email
 * @param { string } password - User password
 * @returns {Promise<{access_token: any, uid: any, client: any, expiry: any}|null>}
 */
export const auth = async (email, password) => {
  const url = `${host}auth/sign_in`;
  const header = await _setHeaders('POST', { email, password });
  const httpRequest = await fetch(url, header).catch((error) => handleHttpError(error));
  const result = await httpRequest.json();

  if (httpRequest.status === 200) {
    return {
      ...result,
      access_token: await httpRequest.headers.get('access-token'),
      client: await httpRequest.headers.get('client'),
      expiry: await httpRequest.headers.get('expiry'),
      uid: await httpRequest.headers.get('uid'),
    };
  }

  handleHttpError(result.errors);
  return result;
};

export const registerDevice = async () => {
  const deviceInfo = await getDeviceInformation();
  const url = `${host}devices`;
  const header = await _setHeaders('POST', { device: { ...deviceInfo } });
  const response = await _fetch(url, header);
  return response !== null;
};

// TODO: normaly doesn't work
export const syncMedicalCases = async (body, userId = null) => {
  const url = `${hostDataServer}${'sync_medical_cases'}`;
  const header = await _setHeaders('POST', body, userId);
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

/**
 * Make the request and parse result
 * @param { string } url - Url to bind
 * @param { object } header - Header options
 * @returns {Promise<string|array>}
 * @private
 */
const _fetch = async (url, header) => {
  const httpRequest = await fetch(url, header).catch((error) => handleHttpError(error));
  const result = await httpRequest.json();

  if (httpRequest.status === 200) {
    return result;
  }

  handleHttpError(result.error);
  return null;
};

/**
 * Set header credentials to communicate with server
 * @params [String] method
 * @params [Object] body
 * @return [Object] header
 * @private
 */
const _setHeaders = async (method = 'GET', body = false) => {
  const credentials = await getItem('session');

  const header = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'access-token': credentials?.access_token,
      'group-token': credentials?.group?.token,
      client: credentials?.client,
      uid: credentials?.uid,
      expiry: credentials?.expiry,

    },
  };

  if (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
    header.body = JSON.stringify(body);
  }

  return header;
};
