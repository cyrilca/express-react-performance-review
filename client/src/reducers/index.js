import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import account from './account'

const mainReducer = combineReducers({
  account,
  router: routerReducer
})

export default mainReducer