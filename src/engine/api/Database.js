import RealmInterface from './dbInterface/RealmInterface';
import { getItem } from './LocalStorage';

export default class Database {
  constructor() {
    this.initDatabase();
  }

  initDatabase = async () => {
    const session = await getItem('session');
    this.architecture = session.group.architecture;
    this.localDataIp = session.group.local_data_ip;
    this.mainDataIp = session.group.main_data_ip;

    // Interface
    this.realmInterface = new RealmInterface();
  };

  getAll = async (isConnected, model) => {
    return this.realmInterface.getAll(model);
  };

  findById = (isConnected, model, id) => {
    return this.realmInterface.findById(model, id);
  };

  createObject = (isConnected, model, obj) => {
    return this.realmInterface.createObject(model, obj);
  };

  writeField = (isConnected, model, id, field, value) => {
    return this.realmInterface.writeField(model, id, field, value);
  };

  writeArray = (isConnected, model, id, field, value) => {
    return this.realmInterface.writeArray(model, id, field, value);
  };
}
