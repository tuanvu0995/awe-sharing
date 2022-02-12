import React, { useEffect, useState } from 'react'
import pt from 'prop-types'
import Tooltip from '../common/Tooltip'
import ConfirmDialog from '../common/ConfirmDialog'
import { withAppContext } from '../context/AppContext'

const avatarUrl = 'https://avataaars.io/'

const getConfirmText = (type, data) => {
  if (!data) {
    return ''
  }
  switch (type) {
    case 'SHARE_REQUEST':
      return `This user was share ${data.fileCount} file ${
        data.fileCount > 1 ? 's' : ''
      }. Do you want to receive them?`
    default:
      return ''
  }
}

const Peer = ({ size, client, requests, socket, roomName, setState }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(Boolean(requests[client.userCode]))
  }, [requests])

  const agreeReceive = () => {
    socket.emit(`${roomName}:share:answer`, { accept: true })
    resetRequest()
  }

  const cancelReceive = () => {
    socket.emit(`${roomName}:share:answer`, { accept: false })
    resetRequest()
  }

  const resetRequest = () => {
    const newRequest = { ...requests }
    delete newRequest[client.userCode]
    setState({ requests: newRequest })
  }

  const confirmContent = () =>
    show && (
      <ConfirmDialog
        text={getConfirmText('SHARE_REQUEST', requests[client.userCode])}
        onAgree={agreeReceive}
        onCancel={cancelReceive}
      />
    )

  const avatar = client.avatar ? client.avatar.replaceAll(',', '&') : ''
  return (
    <div className="peer__container">
      <Tooltip canShow={show} content={confirmContent()}>
        <figure className={`image is-${size}x${size}`}>
          <img className="is-rounded" src={avatarUrl + avatar} />
        </figure>
      </Tooltip>
      <span className="tag is-dark">{client.userCode}</span>
    </div>
  )
}

Peer.propTypes = {
  size: pt.number,
  client: pt.object,
  requests: pt.object,
  roomName: pt.string,
}

Peer.defaultProps = {
  size: 64,
}

const mapContextToProps = (state) => ({
  requests: state.requests,
  roomName: state.roomName,
})

export default withAppContext(Peer, mapContextToProps)
