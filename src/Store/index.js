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
import device from './Device'
import healthFacility from './HealthFacility'
import startup from './Startup'
import system from './System'
import theme from './Theme'
import user from './User'

const reducers = combineReducers({
  algorithm,
  device,
  healthFacility,
  network,
  startup,
  system,
  theme,
  user,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'algorithm',
    'device',
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
