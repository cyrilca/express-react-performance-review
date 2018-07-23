import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      )
    }
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.any,
  isLoggedIn: PropTypes.string
}

export default PrivateRoute