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

function initSocket(state) {
  if (typeof state.roomId === 'undefined') {
    return false
  }

  const { roomId, token } = state

  if (!socket) {
    socket = io({ auth: { token, roomId } })
  }

  /**
   * ------------------------------
   * Basic events
   * ------------------------------
   */
  socket.on('connect', () => logger(`You'r connected`))
  socket.on('disconnect', () => logger(`You'r disconnected.`))
  socket.on('join:reject', () => (window.location.href = '/'))

  return socket
}

export default initSocket
