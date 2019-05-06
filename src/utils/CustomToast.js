// @flow
import { Toast } from 'native-base';

interface ToastType {
  buttonText?: string;
  type?: 'warning' | 'success' | 'danger';
  position?: string;
  duration?: number;
}

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
