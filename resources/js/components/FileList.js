import React from 'react'
import pt from 'prop-types'
import { withAppContext } from '../context/AppContext'

const FileList = ({ files }) => {
  return (
    <nav className="panel is-small">
      <p className="panel-heading">Pined files</p>
      {files.map((file, index) => (
        <a key={index + file.id} className="panel-block">
          <span className="panel-icon">
            <i className="fas fa-book" aria-hidden="true"></i>
          </span>
          {file.name} - {file.size}
        </a>
      ))}
    </nav>
  )
}

FileList.propTypes = {
  files: pt.arrayOf(pt.object),
}

const mapContextToProps = (state) => ({
  files: state.files,
})

export default withAppContext(FileList, mapContextToProps)
