// @flow

import React from 'react';
import Layout from './template/Layout.template';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApplicationProvider } from 'engine/contexts/Application.context';
import { SessionsProvider } from 'engine/contexts/Sessions.context';
import KeepAwake from 'react-native-keep-awake';

import { persistor, store } from '../frontend_service/store';
import CustomModal from './components/CustomModal';
import { getItem } from './engine/api/LocalStorage';


import WavemindTools from 'utils/WavemindTools';

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.isEmpty = function() {
  return this === undefined || this.length === 0;
};

Object.defineProperty(
  Object.prototype,
  'renameKey',
  {
    writable : false, // Cannot alter this property
    enumerable : false, // Will not show up in a for-in loop.
    configurable : false, // Cannot be deleted via the delete operator
    value : function (oldName, newName) {
      // Do nothing if the names are the same
      if (oldName === newName) {
        return this;
      }
      // Check for the old property name to
      // avoid a ReferenceError in strict mode.
      if (this.hasOwnProperty(oldName)) {
        this[newName] = this[oldName];
        delete this[oldName];
      }
      return this;
    }
  }
);

export default class Root extends React.Component {
  async componentWillMount() {
    let settings = await getItem('settings');
    if (settings !== null && settings.app !== undefined && settings.app.awake) {
      KeepAwake.activate();
    }
  }

  render() {

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationProvider>
            <SessionsProvider>
              <Layout />
              <CustomModal />
              {__DEV__ ? <WavemindTools /> : null}
            </SessionsProvider>
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    );
  }
}
