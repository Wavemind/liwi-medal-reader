// jestenv.js:

import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock('react-native-device-info', () => {
  return {
    getModel: jest.fn(),
    isTablet: jest.fn(),
    getDeviceLocale: jest.fn(),
  };
});

jest.mock('@react-native-community/netinfo', () => {
  return {
    RNCNetInfo: jest.fn(),
    addEventListener: jest.fn(),
  };
});

jest.mock('react-native-gesture-handler', () => {
  return {
    Direction: jest.fn(),
  };
});


