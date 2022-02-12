import Peer from './peer'
import { downloadFile } from './download'
import { END_CHUNK, MAX_FILE_CHUNK_SIZE, START_CHUNK } from '../config/constants'

class Packet {
  /**
   * @param {Peer} peer
   * @param {Array} files
   */
  constructor(peer, files = []) {
    this.peer = peer
    this.files = files
    this.receivedBuffers = []
    this.start()
  }

  start() {
    if (this.peer.isLocal()) {
      this.peer.onConnect(() => {
        setTimeout(() => this.files.forEach(this.sendFile), 500)
      })
    }

    if (this.peer.isRemote()) {
      this.peer.onData(this.handleReceive)
    }
  }

  sendFile = async (file) => {
    const fileName = file.name
    console.log('Start send file: ', fileName)
    const arrayBuffer = await file.arrayBuffer()

    let index = 0
    for (let i = 0; i < arrayBuffer.byteLength; i += MAX_FILE_CHUNK_SIZE) {
      const endChunk = i + MAX_FILE_CHUNK_SIZE
      const type = endChunk < arrayBuffer.byteLength ? START_CHUNK : END_CHUNK
      const data = arrayBuffer.slice(i, endChunk)
      console.log(data)
      if (type !== END_CHUNK) {
        this.peer.send(data)
      } else {
        this.peer.send(JSON.stringify({ fileName, end: true }))
      }
      index++
    }

    console.log(fileName, 'is send completed')
  }

  handleReceive = (data) => {
    if (!data.toString().includes('fileName')) {
      this.receivedBuffers.push(data)
    } else {
      const arrayBuffer = this.receivedBuffers.reduce((acc, arrayBuffer) => {
        const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength)
        tmp.set(new Uint8Array(acc), 0)
        tmp.set(new Uint8Array(arrayBuffer), acc.byteLength)
        return tmp
      }, new Uint8Array())
      const blob = new Blob([arrayBuffer], { type: 'octet/stream' })
      const { fileName } = JSON.parse(data.toString())
      downloadFile(blob, fileName)
      this.receivedBuffers.length = 0
      console.log('File download complete!')
      this.close()
    }
  }

  close = () => {
    this.peer.close()
  }

  destroy() {
    delete this
  }
}

export default Packet
