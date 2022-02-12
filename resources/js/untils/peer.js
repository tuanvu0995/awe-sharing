import SimplePeer from 'simple-peer'
import { LOCAL, REMOTE } from '../config/constants'
import { webrtcConfiguration } from '../config/webrtc'

class Peer {
  /**
   * @param {Socket} socket
   */
  constructor(socket, { roomName, initiator = false, receiver, onComplete }) {
    this.socket = socket
    this.roomName = roomName
    this.receiver = receiver
    this.onComplete = onComplete

    this.connection = new SimplePeer({ initiator, config: webrtcConfiguration })
    this.onSignal()
    this.onConnect()
    this.onClose()
    this.onError()
  }

  /**
   * @returns {Peer}
   */
  asLocal() {
    this.type = LOCAL
    return this
  }

  /**
   * @returns {Peer}
   */
  asRemote() {
    this.type = REMOTE
    return this
  }

  onSignal() {
    this.connection.on('signal', (data) => {
      data.receiver = this.receiver
      console.log(this.type, 'signal', data)
      this.socket.emit(`${this.roomName}:signal`, JSON.stringify(data))
    })
  }

  onConnect(callback) {
    this.connection.on('connect', () => {
      !callback && console.log(this.type.toUpperCase(), 'connected')
      callback && callback()
    })
  }

  onData(callback) {
    this.connection.on('data', (data) => {
      callback && callback(data)
    })
  }

  onError() {
    this.connection.on('error', (err) => {
      console.log('ERROR: ' + err)
    })
  }

  onClose() {
    this.connection.on('close', () => {
      console.log('Peer close')
      if (this.onComplete) {
        this.onComplete(this.receiver)
      }
    })
  }

  setSignal(signal) {
    this.connection.signal(signal)
  }

  send(data) {
    this.connection.send(data)
  }

  isLocal() {
    return this.type === LOCAL
  }

  isRemote() {
    return this.type === REMOTE
  }

  close() {
    this.connection.destroy()
  }
}

export default Peer
