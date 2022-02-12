import Peer from './peer'
import { downloadFile } from './download'
import { END_OF_FILE_MESSAGE, MAX_FILE_CHUNK_SIZE } from '../config/constants'

const FILE_DOWNLOAD_COMPLETE_MESSAGE = 'FDCM'

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
    console.log(this.peer.type, this.files.length)
  }

  start() {
    if (this.peer.isLocal()) {
      this.sendCompleted = 0
      this.peer.onConnect(async () => {
        await this.sendFile(this.files[0])
      })
      this.onRemoteDownloaded()
    }

    if (this.peer.isRemote()) {
      this.downloaded = 0
      this.peer.onData(this.handleReceive)
    }
  }

  sendFile = async (file) => {
    const fileName = file.name
    console.log('Start send file: ', fileName)
    const arrayBuffer = await file.arrayBuffer()

    for (let i = 0; i < arrayBuffer.byteLength; i += MAX_FILE_CHUNK_SIZE) {
      const endChunk = i + MAX_FILE_CHUNK_SIZE
      const data = arrayBuffer.slice(i, endChunk)
      this.peer.send(data)
    }

    this.peer.send(END_OF_FILE_MESSAGE)

    console.log(fileName, 'is send completed')
  }

  handleReceive = (data) => {
    if (data.toString() !== END_OF_FILE_MESSAGE) {
      this.receivedBuffers.push(data)
    } else {
      const arrayBuffer = this.receivedBuffers.reduce((acc, arrayBuffer) => {
        const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength)
        tmp.set(new Uint8Array(acc), 0)
        tmp.set(new Uint8Array(arrayBuffer), acc.byteLength)
        return tmp
      }, new Uint8Array())

      const blob = new Blob([arrayBuffer])
      const fileName = this.files[this.downloaded].name

      downloadFile(blob, fileName)

      this.receivedBuffers.length = 0
      console.log(`${fileName} is download complete!`)

      this.downloaded++

      if (this.downloaded >= this.files.length) {
        console.log(`${this.downloaded} downloaded!`)
        this.close()
      }

      if (this.downloaded < this.files.length) {
        this.peer.send(FILE_DOWNLOAD_COMPLETE_MESSAGE)
      }
    }
  }

  close = () => {
    this.peer.close()
  }

  destroy() {
    delete this
  }

  async onRemoteDownloaded() {
    this.peer.onData((data) => {
      if (data.toString() === FILE_DOWNLOAD_COMPLETE_MESSAGE) {
        this.sendCompleted++
        if (this.sendCompleted < this.files.length) {
          this.sendFile(this.files[this.sendCompleted])
        } else {
          console.log(`${this.sendCompleted} were send completed`)
        }
      }
    })
  }
}

export default Packet
