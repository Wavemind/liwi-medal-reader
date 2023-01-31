/**
 * The external imports
 */
import 'react-native-gesture-handler'
import 'react-native-reanimated'
import React, { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { AppState } from 'react-native'
import { PersistGate } from 'redux-persist/lib/integration/react'
import FlashMessage from 'react-native-flash-message'
import ErrorBoundary from 'react-native-error-boundary'
import { connectToDevTools } from 'react-devtools-core'
import * as Sentry from '@sentry/react-native'

/**
 * The internal imports
 */
import { RedirectService } from '@/Services/Device'
import { store, persistor } from '@/Store'
import { ApplicationNavigator } from '@/Navigators'
import './Translations'
import { SENTRY_DSN } from '.env'

Sentry.init({
  dsn: SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 0.8,
  environment: __DEV__ ? 'developpment' : 'production',
  integrations: [
    new Sentry.ReactNativeTracing({
      tracingOrigins: ['localhost', /^\//],
      // ... other options
    }),
  ],
})

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

  /** Setup devTools */
  if (__DEV__) {
    connectToDevTools({
      host: 'localhost',
      port: 8097,
    })
  }

  return (
    <ErrorBoundary>
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

export default Sentry.wrap(App)
