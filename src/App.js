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

// const routingInstrumentation = new Sentry.ReactNavigationV5Instrumentation()

// initialisez Sentry avec votre clé d'API et votre projet
Sentry.init({
  dsn: 'https://784668a0131b414e903863d5386ab1e5@o4503940862377984.ingest.sentry.io/4504569918062592',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'developpment' : 'production',
  integrations: [
    new Sentry.ReactNativeTracing({
      tracingOrigins: ['localhost', /^\//],
      // ... other options
    }),
  ],
  debug: true,
})

const App = () => {
  const appState = useRef(AppState.currentState)

  // Display pin screen after app goes in background
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      // Sentry.flush({
      //   timeout: 5000, // give it 5s to complete the request
      // })
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

  // Sentry.configureScope(scope => {
  //   scope.setTag('app_start_finished', true)
  // })

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
