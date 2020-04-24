import RealmInterface from './dbInterface/RealmInterface';
import HttpInterface from './dbInterface/HttpInterface';

import { getItem } from './LocalStorage';

export default class Database {
  constructor() {
    return (async () => {
      const session = await getItem('session');
      this.isConnected = await getItem('isConnected');
      this.architecture = session.group.architecture;
      this.realmInterface = new RealmInterface();
      this.httpInterface = await new HttpInterface();
      return this;
    })();
  }

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { Collection } - A collection of all the data
   */
  getAll = (model) => {
    const dbInterface = this._checkInterface();
    return this[dbInterface].getAll(model);
  };

  /**
   * Fetch single entry
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The id of the object we want
   * @returns { collection } - Object fetch
   */
  findById = (model, id) => {
    const dbInterface = this._checkInterface();
    return this[dbInterface].findById(model, id);
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = (model, object) => {
    const dbInterface = this._checkInterface();
    return this[dbInterface].insert(model, object);
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @param { object } object - The value of the object
   */
  update = (model, id, field, value) => {
    const dbInterface = this._checkInterface();
    return this[dbInterface].update(model, id, field, value);
  };

  /**
   * Define interface by connection and group architecture
   * @returns {string} interface to use
   * @private
   */
  _checkInterface = () => {
    let dbInterface = '';
    if (this.architecture === 'standalone' || !this.isConnected) {
      dbInterface = 'realmInterface';
    } else {
      dbInterface = 'httpInterface';
    }

    return 'httpInterface';
  };
}
