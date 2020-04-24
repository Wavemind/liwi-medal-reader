import { getItem } from '../LocalStorage';
import { handleHttpError } from '../../../utils/CustomToast';
import { getDeviceInformation } from '../Device';

export default class HttpInterface {
  constructor() {
    return (async () => {
      const session = await getItem('session');
      const user = await getItem('user');
      const deviceInfo = await getDeviceInformation();
      this.localDataIp = session.group.local_data_ip;
      this.mainDataIp = session.group.main_data_ip;
      this.macAddress = deviceInfo.mac_address;
      this.clinician = `${user.first_name} ${user.last_name}`;
      return this;
    })();
  }

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}`;
    const header = await this._setHeaders('POST', object);
    return this._fetch(url, header);
  };

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The id of the object we want
   * @returns { Collection } - The wanted object
   */
  findById = async (model, id) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}/${id}`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { Collection } - A collection of all the data
   */
  getAll = async (model) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @returns { Collection } - Updated object
   */
  update = async (model, id, fields) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}/${id}`;
    const header = await this._setHeaders('PUT', fields);
    return this._fetch(url, header);
  };

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @returns { Collection } - Updated object
   */
  push = async (model, id, field, value) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}/${id}`;
    const header = await this._setHeaders('PUT', { [field]: value });
    return this._fetch(url, header);
  };

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  unlockMedicalCase = async (id) => {
    const url = `${this.localDataIp}/api/medical_cases/${id}/unlock`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * Make the request and parse result
   * @param { string } url - Url to bind
   * @param { object } header - Header options
   * @returns {Promise<string|array>}
   * @private
   */
  _fetch = async (url, header) => {
    const httpRequest = await fetch(url, header).catch((error) => handleHttpError(error));
    const result = await httpRequest.json();

    if (httpRequest.status === 200) {
      return result;
    }

    handleHttpError(result);
    return [];
  };

  /**
   * Map model to local data route
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - local data route
   * @private
   */
  _mapModelToRoute = (model) => {
    let route = '';

    switch (model) {
      case 'Patient':
        route = 'patients';
        break;
      case 'MedicalCase':
        route = 'medical_cases';
        break;
      default:
        console.log('route doesn\'t exist', model);
    }

    return route;
  };

  /**
   * Set header credentials to communicate with server
   * @params [String] method
   * @params [Object] body
   * @return [Object] header
   * @private
   */
  _setHeaders = async (method = 'GET', body = false) => {
    const header = {
      method,
      headers: {
        'mac-address': this.macAddress,
        clinician: this.clinician,
      },
    };

    if (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
      header.body = JSON.stringify(body);
      header.headers['Accept'] = 'application/json';
      header.headers['Content-Type'] = 'application/json';
    }

    return header;
  };
}
