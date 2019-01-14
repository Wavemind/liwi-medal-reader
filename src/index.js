// @flow

import React from 'react';
import Layout from 'template/Layout.template';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './engine/store';
import { ApplicationProvider } from 'engine/contexts/Application.context';
import { SessionsProvider } from 'engine/contexts/Sessions.context';
import { withNamespaces } from 'react-i18next';
import i18n from 'utils/i18n';

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
            <ReloadAppOnLanguageChange />
          </SessionsProvider>
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}
