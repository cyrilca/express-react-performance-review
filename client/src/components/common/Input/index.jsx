import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Input = (props) => {
  const className = classNames('input input--wide', props.className)
  return (
    <input
      {...props}
      className={className}
    />
  )
}

Input.propTypes = {
  className: PropTypes.string
}

Input.defaultProps = {
  className: ''
}

export default Input