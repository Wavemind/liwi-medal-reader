import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, applyMiddleware } from 'redux'
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
import { reducer as network } from 'react-native-offline'
import { configureStore } from '@reduxjs/toolkit'
import { offlineActionTypes } from 'react-native-offline'

import algorithm from './Algorithm'
import device from './Device'
import healthFacility from './HealthFacility'
import startup from './Startup'
import system from './System'
import theme from './Theme'
import user from './User'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { ofType, map } from 'rxjs/operators'

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

const countEpic = action$ => {
  console.log('ici', action$)
  return action$.pipe(
    ofType(action => action.type === offlineActionTypes.CONNECTION_CHANGE),
    map(action => console.log('la connexion a changé')),
  )
}

const epics = combineEpics(countEpic)

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
const epicMiddleware = createEpicMiddleware()

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

    applyMiddleware(epicMiddleware)

    return middlewares
  },
})

const persistor = persistStore(store)
epicMiddleware.run(epics)
export { store, persistor }
