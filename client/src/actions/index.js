import axios from 'axios'

import { push } from 'react-router-redux'
import { notification } from 'antd'

import {
  ENABLE_SPINNER,
  DISABLE_SPINNER,
  SET_JWT_TOKEN,
  SIGN_OUT,
  SET_PROFILE_VALUE
} from './../constants'

export function setJwtToken(value) {
  return { type: SET_JWT_TOKEN, value }
}

export function setProfile(value) {
  return { type: SET_PROFILE_VALUE, value }
}

export function signOut() {
  return { type: SIGN_OUT }
}

export function enableSpinner() {
  return { type: ENABLE_SPINNER }
}

export function disableSpinner() {
  return { type: DISABLE_SPINNER }
}

export function getJwtToken(credentials) {
  return (dispatch) => {
    dispatch({ type: ENABLE_SPINNER })
    const apiUrl = `${process.env.API_URL}/account/login`

    return axios.post(apiUrl, credentials)
      .then((res) => {
        const { token, profile } = res.data
        dispatch(setJwtToken(token))
        dispatch(setProfile(profile))
        // Redirect to home
        dispatch(push('/'))
        dispatch({ type: DISABLE_SPINNER })
      })
      .catch((err) => {
        // Some kind of error handling here
        notification.error({
          message: 'Check your credentials',
          description: 'Email or password is incorrect.',
        })
        dispatch({ type: DISABLE_SPINNER })
      })
  }
}