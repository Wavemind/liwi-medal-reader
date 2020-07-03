// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import KeepAwake from 'react-native-keep-awake';
import ScanbotSDK from 'react-native-scanbot-sdk';
import { Platform } from 'react-native';
import { DocumentDirectoryPath, ExternalDirectoryPath } from 'react-native-fs';
import { ApplicationProvider } from './engine/contexts/Application.context';

import WavemindTools from './utils/WavemindTools';
import { persistor, store } from '../frontend_service/store';

import Layout from './template/Layout.template';
import TooltipModal from './components/ToolTipModal';
import StatusIndicator from './components/StatusIndicator';

export default class Root extends React.Component {
  async componentDidMount() {
    KeepAwake.activate();
    this.initializeSDK();
  }

  getCustomStoragePath(): string {
    // tslint:disable:max-line-length
    // !! Please note !!
    // It is strongly recommended to use the default (secure) storage location of the Scanbot SDK.
    // However, for demo purposes we overwrite the "storageBaseDirectory" of the Scanbot SDK by a custom storage directory.
    //
    // On Android we use the "ExternalDirectoryPath" which is a public(!) folder.
    // All image files and export files (PDF, TIFF, etc) created by the Scanbot SDK in this demo app will be stored
    // in this public storage directory and will be accessible for every(!) app having external storage permissions!
    // Again, this is only for demo purposes, which allows us to easily fetch and check the generated files
    // via Android "adb" CLI tools, Android File Transfer app, Android Studio, etc.
    //
    // On iOS we use the "DocumentDirectoryPath" which is accessible via iTunes file sharing.
    //
    // For more details about the storage system of the Scanbot SDK RN Module please see our docs:
    // - https://scanbotsdk.github.io/documentation/react-native/
    //
    // For more details about the file system on Android and iOS we also recommend to check out:
    // - https://developer.android.com/guide/topics/data/data-storage
    // - https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html
    // tslint:enable:max-line-length

    if (Platform.OS === 'ios') {
      return `${DocumentDirectoryPath}/consent`;
    }
    if (Platform.OS === 'android') {
      return `${ExternalDirectoryPath}/consent`;
    }
    return null;
  }

  async initializeSDK() {
    const licenseKey =
      'hqnCwbxJKalAD9wOQnaPqcJyyMpBc/' +
      'C1YlqKlvY5CsuDirPHZssaOHeG7ZDC' +
      'fZgO+FBKedyzFwB9yCQmK71SuNESw/' +
      'Ly/Qxs6jWbsd+ZMz+WtPChV6CbNyzr' +
      'm9oGA1dIhqHYy7iu3QGXTlv6UnNf34' +
      'm91WqFv4awiPY3yBjH+NXx4oAPps86' +
      'N1BR2B4BUhH/jy4GOg23VMJscxJpzv' +
      'yqInlrVm2/4jnptfaABooJD7htck09' +
      'P5SgKtaGEQmPdiVx7U3TFA66J8fZmd' +
      '7QI4FvNt7Fi/H732QHAdGWZK6v+kag' +
      'eCLg6VfQuSST/f2NRWfDuezDfUsAca' +
      'AT/EyXkuHvOg==\nU2NhbmJvdFNESw' +
      'pjb20ubGl3aV9uYXRpdmUKMTU5NjE1' +
      'MzU5OQo1OTAKMw==\n';

    const options = {
      licenseKey,
      loggingEnabled: true, // Consider switching logging OFF in production builds for security and performance reasons!
      storageImageFormat: 'JPG',
      storageImageQuality: 50,
      storageBaseDirectory: this.getCustomStoragePath(), // Optional storage path. See comments below!
    };
    try {
      const result = await ScanbotSDK.initializeSDK(options);
      console.log(`Scanbot SDK initialization result: ${JSON.stringify(result)}`);
    } catch (ex) {
      console.error(`Scanbot SDK initialization error: ${JSON.stringify(ex.error)}`);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationProvider>
            <Layout />
            <TooltipModal />
            {__DEV__ ? <WavemindTools /> : null}
            <StatusIndicator />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    );
  }
}
