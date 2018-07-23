import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Select = (props) => {
  const className = classNames('select select--wide', props.className)
  return (
    <select
      {...props}
      className={className}
    >
      { props.children }
    </select>
  )
}

Select.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired
}

Select.defaultProps = {
  className: ''
}

export default Select