import React from 'react'

const Dialog = ({ isVisible, children }) => {
  return (
    <div id="modal-js-example" className={`modal ${isVisible ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-content">{isVisible && children}</div>
    </div>
  )
}

export default Dialog
