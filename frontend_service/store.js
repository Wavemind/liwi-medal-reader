import { applyMiddleware, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import { persistReducer, persistStore } from 'redux-persist';
// import FilesystemStorage from 'redux-persist-filesystem-storage';
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers';
import rootEpic from './algorithm/epics.algo';

const persistConfig = {
  debug: __DEV__,
  key: 'medicalCase',
  storage,
  timeout: 10000,
  stateReconciler: hardSet, // see "Merge Process" section for details.
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
export const persistor = persistStore(store, {}, async () => {
});
