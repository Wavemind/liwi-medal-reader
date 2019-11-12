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
  if (errors instanceof Error) {
    Toaster(errors.toString(), { type: 'danger' });
  } else if (isArray(errors)) {
    errors.map((error) => {
      Toaster(error, { type: 'danger' });
    });
  } else {
    Toaster(errors, { type: 'danger' });
  }
};

export const Toaster = (text: string = 'Default', params: ToastType = {}) => {
  const { buttonText = null, type = 'warning', position = 'bottom', duration = 2000 } = params;

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
