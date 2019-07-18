import { applyMiddleware, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './reducers';
import rootEpic from './middlewares/epics';

import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  debug: true,
  key: 'medicalCase',
  storage: AsyncStorage,
  timeout: 10000,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

let composeEnhancers;
if (typeof window !== 'undefined') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

const epicMiddleware = createEpicMiddleware();
const middleware = composeEnhancers(applyMiddleware(thunk, epicMiddleware));
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, middleware);

epicMiddleware.run(rootEpic);

export const persistor = persistStore(store, null, () => {
  console.log('Rehydrate finish, here reducer returned', store.getState());
});
