import io from 'socket.io-client'
import { logger } from './untils/logger'
import Peer from './untils/peer'

let socket

/**
 *
 * @param {Object} state
 * @param {Function} setState
 * @returns
 */

function initSocket(state, setState) {
  if (typeof state.roomId === 'undefined') {
    return false
  }

  const { roomId, token, isHost, userCode } = state
  const roomName = `room:${roomId}`

  if (!socket) {
    socket = io({ auth: { token, roomId } })
  }

  /**
   * ------------------------------
   * Basic events
   * ------------------------------
   */
  socket.on('connect', () => logger(`You'r connected`))
  socket.on('disconnect', () => logger(`You'r disconnected.`, { useToast: false }))

  socket.on(`client:list`, ({ clients }) => {
    logger('client:list', { clients })
    const clientList = clients.filter((client) => client.userCode !== userCode)
    setState({ clients: clientList })
  })

  /**
   * -------------------------------
   * Other clients
   * -------------------------------
   */

  socket.on(`client:joined`, ({ userCode, avatar }) => {
    logger('client:joined', { userCode })
    setState({
      clients: [...state.clients, { userCode, avatar }],
    })
  })

  socket.on(`client:disconnected`, ({ userCode }) => {
    logger('client:disconnected', { userCode })
    setState({
      clients: [...state.clients.filter((client) => client.userCode !== userCode)],
    })
  })

  // Hanlde when join request is denice
  socket.on(`${roomName}:join-request-answer`, ({ answer }) => {
    if (answer === 'denice') {
      window.location.href = '/'
    }
  })

  return socket
}

export default initSocket
