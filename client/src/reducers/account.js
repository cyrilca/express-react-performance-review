import { createSelector } from 'reselect'
import { SET_JWT_TOKEN, ENABLE_SPINNER, DISABLE_SPINNER, SIGN_OUT, SET_PROFILE_VALUE } from './../constants'

export const transactionsSelector = state => state.account.transactions
export const jwtSelector = state => state.account.jwt
export const loadingSelector = state => state.account.loading
export const profileSelector = state => state.account.profile

export const isLoggedInSelector = createSelector(
  jwtSelector,
  jwt => jwt
)

export const initialState = {
  jwt: null,
  profile: null,
  loading: false
}

export default function account(state = initialState, action) {
  const newState = Object.assign({}, state)

  switch (action.type) {
    case 'persist/REHYDRATE':
      newState.jwt = action.payload && action.payload.account ?
        action.payload.account.jwt : initialState.jwt
      newState.profile = action.payload && action.payload.account ?
        action.payload.account.profile : initialState.profile
      break
    case ENABLE_SPINNER:
      newState.loading = true
      break
    case DISABLE_SPINNER:
      newState.loading = false
      break
    case SIGN_OUT:
      newState.jwt = null
      break
    case SET_JWT_TOKEN:
      newState.jwt = action.value
      break
    case SET_PROFILE_VALUE:
      newState.profile = action.value
      break
    default:
      break
  }

  return newState
}