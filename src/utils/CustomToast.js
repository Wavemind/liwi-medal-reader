// @flow
import Toast from 'react-native-tiny-toast';
import isArray from 'lodash/isArray';
import { liwiColors } from './constants';

export const handleHttpError = (errors: any) => {
  // Array of errors maps throw or display it
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
