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
import database from './Database'
import device from './Device'
import emergency from './Emergency'
import healthFacility from './HealthFacility'
import medicalCase from './MedicalCase'
import startup from './Startup'
import patient from './Patient'
import system from './System'
import theme from './Theme'
import scan from './Scan'
import user from './User'
import modal from './Modal'

const reducers = combineReducers({
  algorithm,
  database,
  device,
  emergency,
  healthFacility,
  medicalCase,
  network,
  startup,
  patient,
  system,
  theme,
  scan,
  user,
  modal,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'device',
    'medicalCase',
    'healthFacility',
    'system',
    'theme',
    'user',
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
