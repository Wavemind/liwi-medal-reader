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
    await this.initializeSDK();
  }

  getCustomStoragePath(): string {
    if (Platform.OS === 'ios') return `${DocumentDirectoryPath}/consentFile`;
    if (Platform.OS === 'android') return `${ExternalDirectoryPath}/consentFile`;
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
