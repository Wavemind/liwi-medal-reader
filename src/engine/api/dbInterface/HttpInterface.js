import { getItem } from '../LocalStorage';
import { handleHttpError, displayNotification } from '../../../utils/CustomToast';
import { liwiColors } from '../../../utils/constants';

export default class HttpInterface {
  constructor() {
    return (async () => {
      const session = await getItem('session');
      this.localDataIp = session.group.local_data_ip;
      this.mainDataIp = session.group.main_data_ip;
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
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @param { object } object - The value of the object
   */
  update = async (model, id, field, value) => {
    console.log('httpInterface update');
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

    displayNotification(result, liwiColors.redColor);
    return [];
  };

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
      headers: {},
    };

    if (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
      header.body = JSON.stringify(body);
      header.headers.Accept = 'application/json, text/plain';
      header.headers['Content-Type'] = 'application/json';
    }

    return header;
  };
}
