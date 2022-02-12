import React from 'react'
import Dialog from '../common/Dialog'
import { withAppContext } from '../context/AppContext'

const JoinRequestPopup = ({ requests, socket, roomName, setState }) => {
  const showDialog = requests.length > 0

  if (!showDialog) {
    return null
  }

  const sender = requests[0]

  const onAgree = () => emitJoinRequestAnswer('agree')
  const onCancel = () => emitJoinRequestAnswer('denice')
  const emitJoinRequestAnswer = (answer) => {
    socket.emit(`${roomName}:join:request`, { answer, sender })
    requests.shift()
    setState({
      joinRequests: [...requests],
    })
  }

  

  return (
    <Dialog isVisible={showDialog}>
      <div className="card">
        <div className="card-content">
          <div className="content">User {sender} want to join to your room. Do you agree?</div>
        </div>
        <footer className="card-footer">
          <a onClick={onAgree} className="card-footer-item">
            Agree
          </a>
          <a onClick={onCancel} className="card-footer-item">
            No
          </a>
        </footer>
      </div>
    </Dialog>
  )
}

const mapContextToProps = (state) => ({
  requests: state.joinRequests,
  roomName: state.roomName,
})

export default withAppContext(JoinRequestPopup, mapContextToProps)
