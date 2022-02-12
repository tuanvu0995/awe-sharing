import React from 'react'
import pt from 'prop-types'

const ConfirmDialog = ({ text, onAgree, onCancel }) => {
  return (
    <div className="card" style={{ backgroundColor: 'transparent', maxWidth: 250 }}>
      <div className="card-content">
        <div className="content">{text}</div>
      </div>
      <footer className="card-footer">
        <a onClick={onAgree} className="card-footer-item">
          Okay
        </a>
        <a onClick={onCancel} className="card-footer-item">
          No
        </a>
      </footer>
    </div>
  )
}

ConfirmDialog.propTypes = {
    text: pt.string,
    onAgree: pt.func,
    onCancel: pt.func
}

ConfirmDialog.defaultProps = {
    onAgree: () => {},
    onCancel: () => {}
}

export default ConfirmDialog
