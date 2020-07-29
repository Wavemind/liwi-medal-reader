import { host, hostDataServer } from '../constants';
import { getDeviceInformation } from '../../src/engine/api/Device';
import { handleHttpError } from '../../src/utils/CustomToast';
import { getItem } from '../../src/engine/api/LocalStorage';
import fetch from '../../src/utils/fetchWithTimeout';

/**
 * Get facility configuration by device mac address
 * @returns {Promise<string|Array>}
 */
export const getFacility = async () => {
  const deviceInfo = await getDeviceInformation();
  const hostname = await host();
  const url = `${hostname}devices/${deviceInfo.mac_address}`;
  const header = await _setHeaders();
  return _fetch(url, header);
};

/**
 * Get an algorithm attached to the group
 * @returns {Promise<string|Array>}
 */
export const getAlgorithm = async (json_version) => {
  const deviceInfo = await getDeviceInformation();
  const hostname = await host();
  const url = `${hostname}versions?mac_address=${deviceInfo.mac_address}&json_version=${json_version}`;
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
  const hostname = await host();
  const url = `${hostname}auth/sign_in`;
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

/**
 * Register device in Medal C
 * @returns {Promise<boolean>}
 */
export const registerDevice = async () => {
  const deviceInfo = await getDeviceInformation();
  const hostname = await host();
  const url = `${hostname}devices`;
  const header = await _setHeaders('POST', { device: { ...deviceInfo } });
  const response = await _fetch(url, header);
  return response !== null;
};

/**
 * Send medical cases to main data
 * @param {Array} medicalCases - All medical cases must be synchronize
 * @returns {Promise<string|Array>}
 */
export const synchronizeMedicalCases = async (medicalCases) => {
  const url = `${hostDataServer}sync_medical_cases`;
  const header = await _setHeaders('POST', medicalCases);
  return _fetch(url, header);
};

/**
 * Make the request and parse result
 * @param { string } url - Url to bind
 * @param { object } header - Header options
 * @returns {Promise<string|array>}
 * @private
 */
const _fetch = async (url, header) => {
  const httpRequest = await fetch(url, header).catch((error) => {
    handleHttpError(error);
  });

  if (httpRequest !== undefined) {
    if (httpRequest.status === 204) {
      return null;
    }

    const result = await httpRequest.json();

    if (httpRequest.status === 200) {
      return result;
    }

    // In case of fetch timeout
    if (httpRequest.status > 404) {
      handleHttpError(result.errors);
    }
  }

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
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'access-token': credentials?.access_token,
      'health-facility-token': credentials?.facility?.token,
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
