/**
 * The external imports
 */
import 'react-native-gesture-handler'
import React, { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { AppState, ScrollView, Text } from 'react-native'
import { PersistGate } from 'redux-persist/lib/integration/react'
import FlashMessage from 'react-native-flash-message'
import Appsignal from '@appsignal/javascript'
import { ErrorBoundary } from '@appsignal/react'

/**
 * The internal imports
 */
import { RedirectService } from '@/Services/Device'
import { store, persistor } from '@/Store'
import { ApplicationNavigator } from '@/Navigators'
import './Translations'

const appsignal = new Appsignal({ key: '9c0f7538-551f-41a5-b331-864ba2e04705' })
const FallbackComponent = error => (
  <ScrollView style={{ flex: 1 }}>
    <Text style={{ fontSize: 20, color: 'white', marginBottom: 50 }}>
      AN ERROR OCCURED
    </Text>
  </ScrollView>
)

const App = () => {
  const appState = useRef(AppState.currentState)

  // Display pin screen after app goes in background
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.remove('change', handleAppStateChange)
    }
  }, [])

  /**
   * Redirect user when he's coming back in the app
   */
  const handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      RedirectService()
    }

    appState.current = nextAppState
  }

  return (
    <ErrorBoundary
      instance={appsignal}
      fallback={error => <FallbackComponent error={error} />}
    >
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
    </ErrorBoundary>
  )
}

export default App
