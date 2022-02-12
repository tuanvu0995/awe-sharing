import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', async (socket) => {
  const { room, userCode, avatar } = socket.data

  /**
   * ----------------------------
   * Init
   * ----------------------------
   */

  const hoster = room.getHostClient()
  if (hoster?.userCode === userCode || room.isExists(userCode)) {
    socket.join(room.name)
  }

  if (!room.isExists(userCode)) {
    if (hoster?.userCode !== userCode) {
      room.addJoinRequests(userCode, socket)
      socket.to(hoster?.userCode).emit(`join:request`, { sender: userCode })
    }
  } else {
    room.updateStatus(userCode, true)
    socket.emit(`client:list`, {
      clients: room
        .getClients()
        .filter((client) => Boolean(client.userCode) && Boolean(client.connected)),
    })
    socket.to(room.name).emit(`client:joined`, { userCode, avatar, connected: true })
  }

  /**
   * --------------------------
   * Joining
   * --------------------------
   */

  socket.on(`${room.name}:join:request`, ({ answer, sender }) => {
    if (socket.data.userCode !== hoster.userCode) {
      return
    }

    const requestSocket = room.getJoinRequest(sender)
    if (!requestSocket) {
      return
    }

    if (answer === 'agree') {
      requestSocket.join(room.name)
      room.addClient({ userCode: sender, avatar: requestSocket.data.avatar, connected: true })
      Ws.io
        .to(room.name)
        .emit(`client:joined`, { userCode: sender, avatar: requestSocket.data.avatar })
      requestSocket.emit(`clients:list`, {
        clients: room.getClients(),
      })
      console.log(`Peer ${sender} joined to room ${room.id}`)
    } else {
      requestSocket.emit(`${room.name}:join-request-answer`, { answer })
    }

    room.removeJoinRequest(sender)
  })

  /**
   * -------------------------
   * Share files
   * -------------------------
   */

  socket.on(`${room.name}:share:create`, async ({ files }) => {
    console.log(`User ${userCode} send a file`)
    socket.to(room.name).emit('share:create', { files, sender: userCode })
    room.shareSocket = socket
  })

  socket.on(`${room.name}:share:answer`, ({ accept }) => {
    if (accept) {
      console.log(`User ${userCode} agree a share request from ${room.shareSocket.data.userCode}`)
    }
    room.shareSocket.emit(`share:answer`, { accept, receiver: userCode })
  })

  /**
   * ------------------------
   * Signal exchange
   * ------------------------
   */

  socket.on(`${room.name}:signal`, (data) => {
    let receiverData = JSON.parse(data)
    const { receiver } = receiverData
    console.log('Receive signal from ', userCode, ' and send to ', receiver)

    delete receiverData.receiver
    socket.to(receiver).emit('signal', {
      sender: userCode,
      data: { ...receiverData },
    })
  })

  socket.on('disconnect', () => {
    console.log(userCode + ' is disconnected')
    room.updateStatus(userCode, false)
    socket.leave(room.name)
    socket.leave(userCode)
    socket.to(room.name).emit(`client:disconnected`, { userCode })
  })
})
