import io from 'socket.io-client'
import { logger } from './untils/logger'

let socket

/**
 *
 * @param {Object} state
 * @param {Function} setState
 * @returns
 */

function initSocket(state) {
  const { token } = state

  if (!socket) {
    socket = io({ auth: { token } })
  }

  /**
   * ------------------------------
   * Basic events
   * ------------------------------
   */
  socket.on('connect', () => logger(`You'r connected`))
  socket.on('disconnect', () => logger(`You'r disconnected.`))

  return socket
}

export default initSocket
