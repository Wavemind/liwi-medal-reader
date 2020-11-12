import AsyncStorage from '@react-native-community/async-storage';

import { stringifyDeepRef } from '../../utils/swissKnives';

// @params [String] key, [Object] item
// @return [Object] saved object
// Save value in local storage
export const setItem = async (key, item) => {
  if (key === 'patients') {
    item.map((i) =>
      i.medicalCases.map((medicalCase) => {
        if (medicalCase.patient !== undefined) {
          medicalCase.patient.medicalCases = [];
        }
      })
    );
  }

  if (key === 'algorithm') {
    AsyncStorage.setItem('diagnostics', stringifyDeepRef(item.diagnostics));
    AsyncStorage.setItem('nodes', stringifyDeepRef(item.nodes));
    AsyncStorage.setItem('village_json', stringifyDeepRef(item.village_json));
    delete item.diagnostics;
    delete item.nodes;
    delete item.village_json;
    AsyncStorage.setItem('algorithm', stringifyDeepRef(item));
  } else {
    const controller = stringifyDeepRef(item);
    return AsyncStorage.setItem(key, controller);
  }
};

// @params [String] key
// @return [Object]
// Get value from local storage
export const getItems = async (key) => {
  const items = await AsyncStorage.getItem(key);
  let itemsArray = [];
  try {
    itemsArray = JSON.parse(items);
  } catch (e) {
    console.error(e); // error in the above string (in this case, yes)!
  }

  if (itemsArray === null) {
    return [];
  }
  return itemsArray;
};

// @params key used to store in local storage
// Get item in local storage
export const getItem = async (key) => {
  if (key === 'algorithm') {
    const diagnosticsJSON = await AsyncStorage.getItem('diagnostics');
    const nodesJSON = await AsyncStorage.getItem('nodes');
    const villageJSON = await AsyncStorage.getItem('village_json');
    const algorithmJSON = await AsyncStorage.getItem('algorithm');

    const diagnostics = JSON.parse(diagnosticsJSON);
    const nodes = JSON.parse(nodesJSON);
    const village = JSON.parse(villageJSON);
    const algorithm = JSON.parse(algorithmJSON);

    return {
      ...algorithm,
      diagnostics,
      nodes,
      village_json: village,
    };
  }

  const item = await AsyncStorage.getItem(key);

  let itemObj;
  try {
    itemObj = JSON.parse(item);
  } catch (e) {
    console.error(e); // error in the above string (in this case, yes)!
  }

  return itemObj;
};

// @return [Array]
// Get array from local storage
export const getArray = async (item) => {
  const array = await getItem(item);

  if (array === null) {
    return [];
  }
  return array;
};

// Clear local storage
export const clearLocalStorage = async () => {
  await AsyncStorage.removeItem('medicalCases');
  await AsyncStorage.removeItem('algorithms');
  await AsyncStorage.removeItem('session');
  await AsyncStorage.removeItem('lastLogin');
  await AsyncStorage.clear();
};
