import { Socket } from 'socket.io'

class WsRoom {
  id: string
  name: string
  clients = new Map()
  joinRequests = new Map()
  shareSocket: Socket
  shareRequests = new Map()

  constructor(roomId: string) {
    this.id = roomId
    this.name = `room:${this.id}`
  }

  getClient(userCode: string) {
    return this.clients.get(userCode)
  }

  getClients(): any[] {
    return Array.from(this.clients, ([_, value]) => value)
  }

  addClient(data) {
    if (!data.userCode) {
      return console.log('Client should have user code')
    }
    const client = this.getClient(data.userCode)
    if (client) {
      this.clients.set(data.userCode, { ...client, ...data })
    } else {
      this.clients.set(data.userCode, { ...data })
    }
  }

  updateStatus(userCode, connected) {
    const client = this.getClient(userCode)
    this.clients.set(userCode, { ...client, connected })
  }

  removeClient(userCode) {
    this.clients.delete(userCode)
  }

  isExists(userCode): boolean {
    return this.clients.has(userCode)
  }

  addJoinRequests(userCode, socket) {
    this.joinRequests.set(userCode, socket)
  }

  removeJoinRequest(userCode) {
    this.joinRequests.delete(userCode)
  }

  getJoinRequest(userCode) {
    return this.joinRequests.get(userCode)
  }

  getHostClient() {
    for (const [key, value] of this.clients) {
      if (value.isHost === true) {
        return this.clients.get(key)
      }
    }
    return null
  }

  isHost(userCode) {
    const hoster = this.getHostClient()
    return hoster.userCode === userCode
  }
}

export default WsRoom
