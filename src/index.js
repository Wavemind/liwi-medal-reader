// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import KeepAwake from 'react-native-keep-awake';
import { ApplicationProvider } from './engine/contexts/Application.context';

import WavemindTools from './utils/WavemindTools';
import { persistor, store } from '../frontend_service/store';

import Layout from './template/Layout.template';
import CustomModal from './components/CustomModal';
import StatusIndicator from './components/StatusIndicator';
import EmergencyButton from './components/EmergencyButton';

export default class Root extends React.Component {
  async componentDidMount() {
    KeepAwake.activate();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationProvider>
            <Layout />
            <CustomModal />
            {__DEV__ ? <WavemindTools /> : null}
            <EmergencyButton />
            <StatusIndicator />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    );
  }
}
