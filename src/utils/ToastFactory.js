// @flow
import { Toast } from 'native-base';

interface ToastType {
  buttonText?: string;
  type?: 'warning' | 'success' | 'danger';
  position?: string;
  duration?: number;
}

export const ToastFactory = (text: string = 'Default', params: ToastType) => {
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

export const ErrorHttpFactory = async (response: Object, body: any) => {
    body.errors.map((error) => {
      ToastFactory(error, { type: 'danger' });
    });
};
