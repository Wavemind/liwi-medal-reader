// @flow
import { Toast } from 'native-base';
import isArray from 'lodash/isArray';

interface ToastType {
  buttonText?: string;
  type?: 'warning' | 'success' | 'danger';
  position?: string;
  duration?: number;
}

export const handleHttpError = async (errors: any) => {
  // Array of errors maps throw or display it
  if (isArray(errors)) {
    errors.map((error) => {
      displayToast(error, { type: 'danger' });
    });
  } else {
    displayToast(errors, { type: 'danger' });
  }
};

export const displayToast = (text: string = 'Default', params: ToastType) => {
  const {
    buttonText = '',
    type = 'warning',
    position = 'bottom',
    duration = 2000,
  } = params;

  Toast.show({
    text,
    buttonText,
    type,
    position,
    buttonTextStyle: { color: '#008000' },
    buttonStyle: { backgroundColor: '#5cb85c' },
    duration,
  });
};
