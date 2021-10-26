import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from 'redux'
import { reducer as network } from 'react-native-offline'
import { configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import algorithm from './Algorithm'
import auth from './Auth'
import databaseActivity from './DatabaseActivity'
import databaseMedicalCase from './DatabaseMedicalCase'
import databasePatient from './DatabasePatient'
import databasePatientValues from './DatabasePatientValues'
import device from './Device'
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
import user from './User'
import synchronization from './Synchronization'

const reducers = combineReducers({
  algorithm,
  auth,
  databaseActivity,
  databaseMedicalCase,
  databasePatient,
  databasePatientValues,
  device,
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
  user,
  synchronization,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'auth',
    'device',
    'medicalCase',
    'patient',
    'healthFacility',
    'system',
    'theme',
    'user',
    'emergency',
  ],
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
