// @flow

import React from 'react';
import Layout from './template/Layout.template';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ApplicationProvider} from 'engine/contexts/Application.context';
import {SessionsProvider} from 'engine/contexts/Sessions.context';
import {withNamespaces} from 'react-i18next';
import KeepAwake from 'react-native-keep-awake';
import i18n from 'utils/i18n';

import {
  persistor,
  store,
} from './engine/store';

KeepAwake.activate();

Array.prototype.first = function () {
  return this[0];
};

Array.prototype.isEmpty = function () {
  return this === undefined || this.length === 0;
};

const ReloadAppOnLanguageChange = withNamespaces('common', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(Layout);

export default function Root() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationProvider>
          <SessionsProvider>
            <ReloadAppOnLanguageChange/>
          </SessionsProvider>
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}
