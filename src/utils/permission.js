import { PermissionsAndroid } from 'react-native';

/**
 * Ask user to allow write in external storage
 * Not used actually
 * @returns {Promise<*>}
 * @private
 */
export const askWriteStorage = async () => {
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
};
