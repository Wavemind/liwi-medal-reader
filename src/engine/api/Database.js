import RealmInterface from "./dbInterface/RealmInterface";
import HttpInterface from "./dbInterface/HttpInterface";

import { getItem } from "./LocalStorage";
import { databaseInterface } from "../../../frontend_service/constants";

export default class Database {
  constructor() {
    return (async () => {
      const session = await getItem('session');
      this.architecture = session.group.architecture;
      this.realmInterface = new RealmInterface();
      this.httpInterface = await new HttpInterface();
      return this;
    })();
  }

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Pagination. if null, retrieved all information
   * @returns { Collection } - A collection of all the data
   */
  getAll = async (model, page) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].getAll(model, page);
  };

  /**
   * Fetch single entry
   * @param { string } model - The model name of the data we want to retrieve
   * @param { string } value - The value of the object we want
   * @param { string } field - the field we wanna search on
   * @returns { collection } - Object fetch
   */
  findBy = async (model, value, field = 'id') => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].findBy(model, value, field);
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].insert(model, object);
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @return { object } object - The value of the object
   */
  update = async (model, id, fields) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].update(model, id, fields);
  };

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @return { object } object - The value of the object
   */
  push = async (model, id, field, value) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].push(model, id, field, value);
  };

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  unlockMedicalCase = async (id) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].unlockMedicalCase(id);
  };

  /**
   * Lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  lockMedicalCase = async (id) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].lockMedicalCase(id);
  };

  /**
   * Lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  where = async (model, value, field) => {
    const dbInterface = await this._checkInterface();
    return this[dbInterface].where(model, value, field);
  };

  /**
   * Define interface by connection and group architecture
   * @returns {string} interface to use
   * @private
   */
  _checkInterface = async () => {
    let dbInterface = '';
    const isConnected = await getItem('isConnected');
    if (this.architecture === 'standalone' || !isConnected) {
      dbInterface = databaseInterface.realmInterface;
    } else {
      dbInterface = databaseInterface.httpInterface;
    }
    return databaseInterface.realmInterface;
  };
}
