import AsyncStorage from '@react-native-async-storage/async-storage'
import FilesystemStorage from 'redux-persist-filesystem-storage'
import { combineReducers } from 'redux'
import { reducer as network } from 'react-native-offline'
import { configureStore } from '@reduxjs/toolkit'
import {
  getStoredState,
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import isEmpty from 'lodash/isEmpty'

import algorithm from './Algorithm'
import auth from './Auth'
import databaseActivity from './DatabaseActivity'
import databaseMedicalCase from './DatabaseMedicalCase'
import databasePatient from './DatabasePatient'
import databasePatientValues from './DatabasePatientValues'
import emergency from './Emergency'
import filters from './Filters'
import healthFacility from './HealthFacility'
import medicalCase from './MedicalCase'
import modal from './Modal'
import patient from './Patient'
import questionsPerSystem from './QuestionsPerSystem'
import startup from './Startup'
import system from './System'
import scan from './Scan'
import theme from './Theme'
import validation from './Validation'
import synchronization from './Synchronization'

const reducers = combineReducers({
  algorithm,
  auth,
  databaseActivity,
  databaseMedicalCase,
  databasePatient,
  databasePatientValues,
  emergency,
  filters,
  healthFacility,
  medicalCase,
  modal,
  network,
  questionsPerSystem,
  startup,
  patient,
  system,
  theme,
  scan,
  validation,
  synchronization,
})

const persistConfig = {
  key: 'root',
  storage: FilesystemStorage,
  whitelist: [
    'auth',
    'medicalCase',
    'patient',
    'healthFacility',
    'system',
    'theme',
    'emergency',
  ],
  version: 1,
  timeout: null,
  migrate: async state => {
    // TODO: SHOULD BE REMOVED IN NEXT RELEASE
    // Migrate from AsyncStorage to FilesystemStorage
    const asyncState = await getStoredState({
      key: 'root',
      storage: AsyncStorage,
    })

    if (
      !!asyncState &&
      asyncState?.auth?.item.hasOwnProperty('deviceId') &&
      !state?.auth?.item.hasOwnProperty('deviceId')
    ) {
      // if state from fs storage is empty try to read state from previous storage
      try {
        if (!isEmpty(asyncState)) {
          // if data exists in `AsyncStorage` - rehydrate fs persistor with it
          return asyncState
        }
      } catch (getStateError) {
        __DEV__ && console.warn('getStoredState error', getStateError)
      }
    }
    return state
  },
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    }

    return middlewares
  },
})

const persistor = persistStore(store)

export { store, persistor }
