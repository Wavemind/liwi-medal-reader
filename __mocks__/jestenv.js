import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import { NativeModules } from 'react-native'
import mockNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
import 'react-native-gesture-handler/jestSetup'

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('@react-native-community/netinfo', () => mockNetInfo)
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('@react-native-picker/picker', () => {})
jest.mock('@react-native-community/checkbox', () => {})
jest.mock('lottie-react-native', () => {})
jest.mock('react-content-loader/native', () => {})
jest.mock('react-native-webview', () => {})
jest.mock('@haskkor/react-native-pincode', () => {})
jest.mock('react-native-toggle-element', () => {})
jest.mock('@react-native-community/slider', () => {})
jest.mock('react-native-modal', () => {})
jest.mock('react-native-video', () => {})
jest.mock('@react-navigation/material-top-tabs', () => {})
jest.mock('react-native-camera', () => {})
jest.mock('react-native-qrcode-scanner', () => {})
jest.mock('react-native-sound-player', () => {})
jest.mock('react-native-orientation-locker', () => {})
jest.mock('react-native-vector-icons/Feather', () => {})
jest.mock('react-native-blob-util', () => {})
jest.mock('react-native-date-picker', () => jest.fn())
jest.mock('react-native-offline', () => {
  return {
    reducer: {},
  }
})
jest.mock('react-native-responsive-screen', () => {
  return {
    heightPercentageToDP: jest.fn(),
    widthPercentageToDP: jest.fn(),
  }
})
jest.mock('react-native-flash-message', () => {
  return {
    showMessage: jest.fn(),
  }
})
jest.mock('react-native-vector-icons', () => {
  return {
    createIconSetFromIcoMoon: jest.fn(),
  }
})
jest.mock('react-native-keychain', () => {
  return {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
    resetGenericPassword: jest.fn(),
  }
})
jest.mock('react-native-device-info', () => {
  return {
    getMacAddress: jest.fn(),
    getModel: jest.fn(),
    isTablet: jest.fn(),
    getDeviceLocale: jest.fn(),
    getVersion: jest.fn(),
    getBuildNumber: jest.fn(),
  }
})
jest.mock('@react-navigation/native', () => {
  return {
    createAppContainer: jest
      .fn()
      .mockReturnValue(function NavigationContainer(props) {
        return null
      }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    createSwitchNavigator: jest.fn(),
    withNavigation: component => component,
    StackActions: {
      push: jest
        .fn()
        .mockImplementation(x => ({ ...x, type: 'Navigation/PUSH' })),
      replace: jest
        .fn()
        .mockImplementation(x => ({ ...x, type: 'Navigation/REPLACE' })),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation(x => x),
      setParams: jest.fn().mockImplementation(x => x),
    },
    NavigationEvents: 'mockNavigationEvents',
  }
})
jest.mock('@react-navigation/drawer', () => {
  return {
    createDrawerNavigator: jest.fn(),
  }
})

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(),
    Header: () => 'whatever',
  }
})

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
  }
})

jest.mock('react-native-zip-archive', () => {})

jest.mock('react-native-gesture-handler', () => {
  return {
    Direction: jest.fn(),
  }
})

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve()),
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}
jest.mock('react-native', () => ({
  NetInfo: {
    isConnected: {
      fetch: jest.fn(),
    },
    addEventListener: jest.fn(),
    fetch: () => {
      return {
        done: jest.fn(),
      }
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
}))

global.console = {
  log: jest.fn(), // console.log are ignored in tests

  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  error: console.error,
  warn: jest.fn(),
  info: console.info,
  debug: console.debug,
}
