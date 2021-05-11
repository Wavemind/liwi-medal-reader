import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ReduxNetworkProvider } from 'react-native-offline'
import FlashMessage from 'react-native-flash-message'

import { store, persistor } from '@/Store'
import { ApplicationNavigator } from '@/Navigators'

import './Translations'

const App = () => (
  <Provider store={store}>
    <ReduxNetworkProvider>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
        <FlashMessage position="bottom" floating={true} icon="auto" />
      </PersistGate>
    </ReduxNetworkProvider>
  </Provider>
)

export default App
