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

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-navigation', () => {
  return {
    createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {return null;}),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    StackActions: {
      push: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/PUSH"})),
      replace: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/REPLACE"})),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation(x => x),
    }
  }
});

jest.mock("react-navigation-drawer", () => {
  return {
    createDrawerNavigator: jest.fn()
  }
});
