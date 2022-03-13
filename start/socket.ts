import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', async (socket) => {
  const { user } = socket.data

  // Join my room
  socket.join(user.uid)

  /**
   * ----------------------------
   * Init
   * ----------------------------
   */

  /**
   * -------------------------
   * Share files
   * -------------------------
   */

  socket.on(`share:create`, async ({ files }) => {})

  socket.on(`share:answer`, ({ accept }) => {})

  /**
   * ------------------------
   * Signal exchange
   * ------------------------
   */

  socket.on(`signal`, (data) => {
    const userCode = ''
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
    console.log(user.name + ' is disconnected')
    socket.leave(user.uid)
  })
})
