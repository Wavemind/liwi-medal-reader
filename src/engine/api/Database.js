import RealmInterface from './dbInterface/RealmInterface';
import { getItem } from './LocalStorage';

export default class Database {
  constructor() {
    // Interface
    this.realmInterface = new RealmInterface();

    this.initDatabase();
  }

  initDatabase = async () => {
    const session = await getItem('session');
    this.isConnected = await getItem('isConnected');
    this.architecture = session.group.architecture;
    this.localDataIp = session.group.local_data_ip;
    this.mainDataIp = session.group.main_data_ip;
  };

  getAll = async (model) => {
    return this.realmInterface.getAll(model);
  };

  findById = (model, id) => {
    return this.realmInterface.findById(model, id);
  };

  createObject = (model, obj) => {
    return this.realmInterface.createObject(model, obj);
  };

  writeField = (model, id, field, value) => {
    return this.realmInterface.writeField(model, id, field, value);
  };

  writeArray = (model, id, field, value) => {
    return this.realmInterface.writeArray(model, id, field, value);
  };
}
