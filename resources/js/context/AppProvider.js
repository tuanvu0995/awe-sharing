import React from 'react'
import AppContext from './AppContext'

import { initDropPrevent } from '../untils/dragDrop'
import initSocket from '../client'

import Peer from '../untils/peer'
import Packet from '../untils/packet'
import { size } from 'lodash'

class AppProvider extends React.Component {
  constructor(props) {
    super(props)
    const { avatar, userCode, roomId, isHost, token } = pageData
    this.state = {
      clients: [],
      avatar,
      userCode,
      roomId,
      isHost,
      token,
      isReady: false,
      roomName: 'room:' + roomId,
      isLoading: false,
      requests: {},
      joinRequests: [],
      files: [],
    }
    this.socket = initSocket(this.state, this.setState.bind(this))
    this.packets = {}
    this.files = []
  }

  sendToRoom(event, data) {
    this.socket.emit(`${this.state.roomName}:${event}`, data)
  }

  componentDidMount() {
    this.initDrop()
    this.initSocket()
  }

  initDrop = () => {
    this.dropArea = document.getElementById('drop-area')
    initDropPrevent(this.dropArea)
    this.dropArea.addEventListener('drop', this.handlerDrop, false)
  }

  initSocket = () => {
    this.socket.on('signal', (data) => {
      console.log(data)
      const peer = new Peer(this.socket, {
        roomName: this.state.roomName,
        receiver: data.sender,
        onComplete: this.onComplete.bind(this),
      }).asRemote()
      const packet = new Packet(peer)
      if (!this.packets[data.sender]) {
        delete this.packets[data.sender]
      }
      this.packets[data.sender] = packet
      this.packets[data.sender].peer.setSignal(data)
    })

    this.socket.on(`join:request`, ({ sender }) => {
      this.setState({
        joinRequests: [...this.state.joinRequests, sender],
      })
    })

    this.socket.on('share:answer', ({ accept, receiver }) => {
      console.log('receive share answer')
      if (!accept) {
        return
      }

      const peer = new Peer(this.socket, {
        roomName: this.state.roomName,
        initiator: true,
        receiver,
        onComplete: this.onComplete.bind(this),
      }).asLocal()
      const packet = new Packet(peer, this.files)
      this.packets[receiver] = packet
    })

    this.socket.on('share:create', ({ files, sender }) => {
      console.log('Receive share request from ' + sender)
      this.setState({
        requests: { ...this.state.requests, [sender]: files },
      })
    })
  }

  handlerDrop = (e) => {
    let dt = e.dataTransfer
    this.files = [...dt.files]
    this.createShareRequest()
  }

  createShareRequest() {
    const files = this.files.map((file) => ({
      name: file.name,
      size: file.size,
    }))
    this.sendToRoom('share:create', { files })
  }

  onComplete(receiver) {
    delete this.packets[receiver]
  }

  render = () => {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setState: this.setState.bind(this),
          socket: this.socket,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppProvider
