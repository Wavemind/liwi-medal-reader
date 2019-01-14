import { createStore, applyMiddleware } from 'redux';
import { filter, mapTo } from 'rxjs/operators';
import { createEpicMiddleware, combineEpics, ofType } from 'redux-observable';
import thunk from 'redux-thunk';

import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/es/storage';

import rootReducer from './reducers';
import rootEpic from './middlewares/epics';

const persistConfig = {
  debug: true,
  key: 'primary',
  storage,
  timeout: 10000,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  whitelist: ['medicalCase'],
};

const epicMiddleware = createEpicMiddleware();

const middleware = applyMiddleware(thunk, epicMiddleware);

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, middleware);

epicMiddleware.run(rootEpic);

export const persistor = persistStore(store, null, () => {
  // console.log("Rehydrate finish, here reducer returned", store.getState())
});
