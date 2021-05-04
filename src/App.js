import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import { ApplicationNavigator } from '@/Navigators'
import FlashMessage from 'react-native-flash-message'
import './Translations'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApplicationNavigator />
      <FlashMessage position="bottom" floating={true} icon="auto" />
    </PersistGate>
  </Provider>
)

export default App
