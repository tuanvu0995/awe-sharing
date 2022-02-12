import React from 'react'

const DropArea = () => {
  return (
    <div className="card drop-area" id="drop-area">
      <div className="card-body">
        <form className="my-form">
          <p>
            Upload multiple files with the file dialog or by dragging and dropping images onto the
            dashed region
          </p>
        </form>
      </div>
    </div>
  )
}

export default DropArea
