import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import Encryption from '@ioc:Adonis/Core/Encryption'
import User from 'App/Models/User'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!, {
      pingTimeout: 60000,
      pingInterval: 30000,
      cors: {
        origin: '*',
      },
    })
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token

      if (token) {
        const uid = Encryption.decrypt(token)
        console.log(uid)
        const user = await User.findBy('uid', uid)
        console.log(`User ${user?.name} connected`)
        socket.data.user = user
        next()
      }
    })
    this.io.use(this.initRoom)
  }

  initRoom = async (socket, next) => {
    next()
  }
}

export default new Ws()
