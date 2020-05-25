// @flow
import Toast from 'react-native-tiny-toast';
import isArray from 'lodash/isArray';
import { liwiColors } from './constants';

/**
 * Display errors in a toast
 * @param {any} errors - Can be an hash, array or simple messages
 */
export const handleHttpError = (errors: any) => {
  console.log(errors);
  if (errors instanceof Error) {
    displayNotification(errors.toString(), liwiColors.redColor);
  } else if (isArray(errors)) {
    errors.map((error) => {
      displayNotification(error, liwiColors.redColor);
    });
  } else {
    displayNotification(errors, liwiColors.redColor);
  }
};

/**
 * Display a toast
 * @param {string} message - Message to display
 * @param {string} color - Background color
 * @private
 */
export const displayNotification = (message, color) => {
  Toast.show(message, {
    position: 20,
    textStyle: { color: liwiColors.whiteColor },
    containerStyle: {
      minWidth: 105,
      minHeight: 60,
      backgroundColor: color,
      zIndex: 2000,
    },
  });
};
