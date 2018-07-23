import 'babel-polyfill'
import 'antd/dist/antd.css'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Router } from 'react-router'

import App from './App'
import configureStore from './store'

const { store, persistor } = configureStore()

const renderApp = (Component) => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  )
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const newApp = require('./App').default
    render(newApp)
  })
}