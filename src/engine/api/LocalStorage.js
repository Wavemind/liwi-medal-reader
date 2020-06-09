import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import findIndex from "lodash/findIndex";
import _ from "lodash";
import maxBy from "lodash/maxBy";
import { stringifyDeepRef } from "../../utils/swissKnives";

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
  const controller = stringifyDeepRef(item);

  return await AsyncStorage.setItem(key, controller);
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

// @params [String] key [Integer] index, [Integer] id
// @return [Object]
// Get value from an array in local storage
export const getItemFromArray = async (key, index, id) => {
  const items = await getItems(key);

  if (Array.isArray(items)) {
    return items.find((item) => {
      return item[index] === id;
    });
  }

  return {};
};

// Helper to update an item in an array
// @params [String] key [Object] newItem, [Integer] id
// key = key of array in localstorage
// newItem = Object of new item
// id = id of the item we want to update
export const setItemFromArray = async (key, newItem, id) => {
  const items = await getArray(key);

  if (Array.isArray(items)) {
    const index = findIndex(items, (item) => {
      return item.id === id;
    });

    if (index === -1) {
      items.push(newItem);
    } else {
      items[index] = newItem;
    }

    await setItem(key, items);
  }

  return {};
};

// @params key used to store in local storage
// Get item in local storage
export const getItem = async (key) => {
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
// Get session from local storage
export const getSessions = async () => {
  const sessions = await AsyncStorage.getItem('sessions');
  const sessionsArray = JSON.parse(sessions);
  if (sessionsArray === null) {
    return [];
  }
  return sessionsArray;
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

// TODO Probably don't need this shit anymore
// @params [Object] medicalCase
// Set medical case in local storage
export const storeMedicalCase = async (medicalCase) => {
  const patients = await getItems('patients');

  if (Array.isArray(patients)) {
    patients.map((patient, patientID) => {
      const idMedicalCase = findIndex(patient.medicalCases, (item) => {
        return item.id === medicalCase.id;
      });
      patients[patientID].medicalCases[idMedicalCase] = medicalCase;
    });

    await setItem('patients', patients);
  }
};

// @params [Integer] newMedicalCase
// @return [Object] medicalCase
// Generate a new medical case
export const createMedicalCase = async (newMedicalCase) => {
  try {
    const medicalCases = await getItems('medicalCases');
    let maxId = maxBy(medicalCases, 'id');

    if (medicalCases.length === 0) {
      maxId = { id: 0 };
    }

    newMedicalCase.id = maxId.id + 1;

    medicalCases.push(newMedicalCase);

    return await setItem('medicalCases', medicalCases);
  } catch (e) {
    return e;
  }
};

// @params [Integer] id, [Object] newSession
// @return [Object] medicalCase
export const updateSession = async (id, newSession) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    const index = findIndex(sessions, (session) => {
      return session.data.id === id;
    });

    sessions.splice(index, 1, newSession);
  }
  await setSessions(sessions);
};

// Clear sessions from local storage
export const clearSessions = async () => {
  await AsyncStorage.removeItem('sessions');
};

// Clear patients in local storage
export const clearPatients = async () => {
  await AsyncStorage.removeItem('patients');
};

// Clear local storage
export const clearLocalStorage = async () => {
  await AsyncStorage.removeItem('medicalCases');
  await AsyncStorage.removeItem('algorithms');
  await AsyncStorage.removeItem('patients');
  await AsyncStorage.removeItem('sessions');
  await AsyncStorage.removeItem('lastLogin');
  await AsyncStorage.clear();
};

// @params [Object] session
// Set session credentials in local storage
export const setSessions = async (session) => {
  await AsyncStorage.setItem('sessions', stringifyDeepRef(session));
};

// @params [Integer] id
// Set current session
export const setActiveSession = async (id = null) => {
  const sessions = await getItems('sessions');
  await sessions.map((session) => {
    if (session.active === undefined || session.active === true) {
      session.active = false;
      session.active_since = false;
    }

    if (session.data.id === id) {
      session.active = true;
      session.active_since = moment().format();
    }
  });

  await setSessions(sessions);
};

// @params [Integer] id
// @return [Object] session
// Get session from local storage
export const getSession = async (id) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    const findSession = sessions.find((session) => {
      return session.data.id === id;
    });

    if (findSession === undefined) {
      return { access_token: 'unsecure' };
    }

    return findSession;
  }
  return {};
};

// @params [Integer] id
// Return patient medical cases
export const getMedicalCase = async (id) => {
  const patients = await getItems('patients');
  let item = null;

  patients.map((patient) => {
    const f = _.find(patient.medicalCases, (m) => m.id === id);
    if (f !== undefined) {
      item = f;
    }
  });
  return item;
};
