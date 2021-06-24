import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import FlashMessage from 'react-native-flash-message'

import { store, persistor } from '@/Store'
import { ApplicationNavigator } from '@/Navigators'

import './Translations'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
        <FlashMessage
          position="top"
          floating={true}
          icon="auto"
          titleStyle={{
            fontFamily: 'ZeitungPro-Bold',
          }}
          textStyle={{ fontFamily: 'ZeitungPro', fontSize: 18 }}
        />
      </PersistGate>
    </Provider>
  )
}

export default App
