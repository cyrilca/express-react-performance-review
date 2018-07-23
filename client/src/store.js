import logger from 'redux-logger'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import { createStore, compose, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import { middleware } from './history'
import reducers from './reducers'

const persistConfig = {
  key: 'store',
  storage
}

let createAppStore = compose(
  applyMiddleware(thunk, middleware)
)(createStore)

if (module.hot) {
  createAppStore = composeWithDevTools(
    applyMiddleware(logger, thunk, middleware)
  )(createStore)
}

const persistedReducer = persistReducer(persistConfig, reducers)

const configureStore = (initialState = {}) => {
  const store = createAppStore(persistedReducer, initialState)
  const persistor = persistStore(store)

  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers'))
    )
  }

  return { store, persistor }
}

export default configureStore