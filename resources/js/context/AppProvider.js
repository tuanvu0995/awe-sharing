import React from 'react'
import AppContext from './AppContext'

import { initDropPrevent } from '../untils/dragDrop'
import initSocket from '../client'

import Peer from '../untils/peer'
import Packet from '../untils/packet'
import { logger } from '../untils/logger'

class AppProvider extends React.Component {
  constructor(props) {
    super(props)
    const { user, token } = pageData
    this.state = {
      clients: [],
      user,
      token,
      isReady: false,
      isLoading: false,
      requests: {},
      files: [],
    }
    this.socket = initSocket(this.state)
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
    this.socket.on(`client:list`, ({ clients }) => {
      logger('client:list', { clients })
      const clientList = clients.filter((client) => client.uid !== this.state.user.uid)
      this.setState({ clients: clientList })
    })

    this.socket.on(`client:joined`, (client) => {
      logger('client:joined', { name: client.name, clients: this.state.clients })
      this.setState({
        clients: [...this.state.clients, client],
      })
    })

    this.socket.on(`client:disconnected`, ({ uid }) => {
      const client = this.clients.find((client) => client.uid === uid)
      logger('client:disconnected', { name: client.name })
      this.setState({
        clients: [...this.state.clients.filter((client) => client.uid !== uid)],
      })
    })

    this.socket.on('signal', (data) => {
      logger('Receive remote signal: ', data)

      if (!this.packets[data.sender]) {
        const peer = new Peer(this.socket, {
          roomName: this.state.roomName,
          receiver: data.sender,
          onComplete: this.onComplete.bind(this),
        }).asRemote()

        this.packets[data.sender] = new Packet(peer, this.state.requests[data.sender])
      }

      this.packets[data.sender].peer.setSignal(data.data)
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
