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
    createSwitchNavigator: jest.fn(),
    withNavigation: (component) => component,
    StackActions: {
      push: jest.fn().mockImplementation((x) => ({ ...x, type: 'Navigation/PUSH' })),
      replace: jest.fn().mockImplementation((x) => ({ ...x, type: 'Navigation/REPLACE' })),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation((x) => x),
      setParams: jest.fn().mockImplementation((x) => x),
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
  return {
    createStackNavigator: jest.fn(),
    Header: () => 'whatever',
  };
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
  StyleSheet: {
    create: () => {},
  },
  View: jest.fn(),
  Platform: {
    OS: jest.fn(() => 'android'),
    version: jest.fn(() => 25),
  },
  PixelRatio: {
    getPixelSizeForLayoutSize: jest.fn(),
  },
}));

jest.mock('../i18n.js', () => {
  return {
    addResourceBundle: jest.fn(),
    t: jest.fn(),
  };
});

jest.mock('react-native-tiny-toast', () => {});
jest.mock('react-native-zip-archive', () => {});
jest.mock('react-native-safe-modules', () => {});
jest.mock('lottie-react-native', () => {});
jest.mock('native-base', () => {});
jest.mock('@haskkor/react-native-pincode', () => {});
jest.mock('react-native-rectangle-scanner', () => {});
jest.mock('react-native-camera', () => {});
jest.mock('react-native-qrcode-scanner', () => {});
jest.mock('react-native-video', () => {});
jest.mock('react-native-orientation-locker', () => {});
jest.mock('react-native-slider', () => {});
jest.mock('react-native-sound', () => {});
jest.mock('react-native-lightbox', () => {});
jest.mock('react-native-vector-icons/MaterialIcons', () => {});
jest.mock('react-native-vector-icons', () => {});

jest.mock(
  'rn-fetch-blob',
  () => {
    const mRNFetchBlob = {
      fetch: jest.fn(),
      default: {
        fs: {
          dirs: {
            MainBundleDir: () => {},
            CacheDir: () => {},
            DocumentDir: () => {},
          },
        },
      },
      fs: {
        dirs: {
          MainBundleDir: () => {},
          CacheDir: () => {},
          DocumentDir: () => {},
        },
      },
    };
    return mRNFetchBlob;
  },
  { virtual: true }
);

jest.mock('react-native-autocomplete-input', () => 'Autocomplete');
