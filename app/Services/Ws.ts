import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import Encryption from '@ioc:Adonis/Core/Encryption'
import WsRoom from './WsRoom'
import Avatar from 'App/Models/Avatar'
import Room from 'App/Models/Room'

class Ws {
  public io: Server
  private booted = false

  public rooms = new Map()

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!, { pingTimeout: 60000, pingInterval: 30000 })
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token
      const roomId = socket.handshake.auth.roomId
      const userCode = Encryption.decrypt(token)
      if (!userCode) {
        next(new Error('token invalid'))
      } else {
        const avatar = await Avatar.findBy('user_code', userCode)
        socket.data.userCode = userCode
        socket.data.roomId = roomId
        socket.data.avatar = avatar?.data || ''

        socket.join(userCode + '') // join his room
        console.log(`User ${userCode} connected`)

        next()
      }
    })
    this.io.use(this.initRoom)
  }

  initRoom = async (socket, next) => {
    const { roomId } = socket.data
    let room = this.getRoom(roomId)
    if (!room) {
      const roomModel = await Room.findBy('rid', roomId)
      if (roomModel) {
        room = new WsRoom(roomModel.rid)
        this.addRoom(room)
      }
    }

    if (!room) {
      return console.log(`Room doesn't exsits.`)
    }

    socket.data.room = room

    console.log('Found a room: ', room.id)
    next()
  }

  addRoom(room) {
    this.rooms.set(room.id, room)
  }

  getRoom(roomId): WsRoom {
    return this.rooms.get(roomId)
  }

  isRoomExists(roomId): boolean {
    return this.rooms.has(roomId)
  }
}

export default new Ws()
