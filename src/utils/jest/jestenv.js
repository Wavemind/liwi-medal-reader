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
    createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {
      return null;
    }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    withNavigation: jest.fn(),
    StackActions: {
      push: jest.fn().mockImplementation((x) => ({ ...x, type: 'Navigation/PUSH' })),
      replace: jest.fn().mockImplementation((x) => ({ ...x, type: 'Navigation/REPLACE' })),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation((x) => x),
    },
    NavigationEvents: 'mockNavigationEvents',
  };
});

jest.mock('react-navigation-drawer', () => {
  return {
    createDrawerNavigator: jest.fn(),
  };
});

jest.mock('react-navigation-stack', () => {
  return { Header: () => 'whatever' };
});

jest.mock('react-native-fs', () => {
  return {
    mkdir: jest.fn(),
    moveFile: jest.fn(),
    copyFile: jest.fn(),
    pathForBundle: jest.fn(),
    pathForGroup: jest.fn(),
    getFSInfo: jest.fn(),
    getAllExternalFilesDirs: jest.fn(),
    unlink: jest.fn(),
    exists: jest.fn(),
    stopDownload: jest.fn(),
    resumeDownload: jest.fn(),
    isResumable: jest.fn(),
    stopUpload: jest.fn(),
    completeHandlerIOS: jest.fn(),
    readDir: jest.fn(),
    readDirAssets: jest.fn(),
    existsAssets: jest.fn(),
    readdir: jest.fn(),
    setReadable: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    read: jest.fn(),
    readFileAssets: jest.fn(),
    hash: jest.fn(),
    copyFileAssets: jest.fn(),
    copyFileAssetsIOS: jest.fn(),
    copyAssetsVideoIOS: jest.fn(),
    writeFile: jest.fn(),
    appendFile: jest.fn(),
    write: jest.fn(),
    downloadFile: jest.fn(),
    uploadFiles: jest.fn(),
    touch: jest.fn(),
    MainBundlePath: jest.fn(),
    CachesDirectoryPath: jest.fn(),
    DocumentDirectoryPath: jest.fn(),
    ExternalDirectoryPath: jest.fn(),
    ExternalStorageDirectoryPath: jest.fn(),
    TemporaryDirectoryPath: jest.fn(),
    LibraryDirectoryPath: jest.fn(),
    PicturesDirectoryPath: jest.fn(),
  };
});

jest.mock('react-native-permissions', () => {});

jest.mock('react-native', () => ({
  NetInfo: {
    addEventListener: jest.fn(),
    fetch: () => {
      return {
        done: jest.fn(),
      };
    },
  },
  NativeModules: {
    RNPasscodeStatus: {
      supported: jest.fn(),
      status: jest.fn(),
      get: jest.fn(),
    },
  },
  Dimensions: {
    get: () => ({
      width: jest.fn(),
      height: jest.fn(),
    }),
  },
}));

jest.mock('../i18n', () => {
  return {
    addResourceBundle: jest.fn(),
  };
});

jest.mock('react-native-tiny-toast', () => {});

// jest.mock('rn-fetch-blob', () => {
//   return {
//     DocumentDir: () => {},
//     ImageCache: {
//       get: {
//         clear: () => {},
//       },
//     },
//     fs: {
//       dirs: {
//         MainBundleDir: () => {},
//         CacheDir: () => {},
//         DocumentDir: () => {},
//       },
//     },
//     default: {
//       fs: {
//         exists: () => {},
//       },
//     },
//   };
// });

jest.mock(
  'rn-fetch-blob',
  () => {
    const mRNFetchBlob = {
      fetch: jest.fn(),
      default: {
        fs: {
          dirs: {
            MainBundleDir: () => {
            },
            CacheDir: () => {
            },
            DocumentDir: () => {
            },
          },
        },
      },
      fs: {
        dirs: {
          MainBundleDir: () => {
          },
          CacheDir: () => {
          },
          DocumentDir: () => {
          },
        },
      },
    };
    return mRNFetchBlob;
  },
  { virtual: true },
);
