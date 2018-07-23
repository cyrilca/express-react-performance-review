import React from 'react'
import PropTypes from 'prop-types'
import filterReactProps from 'filter-react-props'

const Button = (props) => {
  const safeProps = filterReactProps(props, 'button')
  const { children, loading } = props
  const content = loading ? <div className='loading-spinner'></div> : children
  return (
    <button {...safeProps} className='btn'>
      { content }
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.string]),
  loading: PropTypes.bool
}

Button.defaultProps = {
  loading: false,
  children: ''
}

export default Button