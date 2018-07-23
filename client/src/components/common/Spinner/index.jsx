import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Spinner = ({ center, large }) => {
  const spinnerClasses = classNames(
    'loading-spinner',
    {
      'loading-spinner--center': center,
      'loading-spinner--large': large
    }
  )
  return (
    <div className={spinnerClasses}></div>
  )
}

Spinner.propTypes = {
  center: PropTypes.bool,
  large: PropTypes.bool
}

Spinner.defaultProps = {
  center: false,
  large: false
}

export default Spinner