import { nanoid } from "nanoid"

/**
 * @param {String} sender 
 * @returns {String}
 */
export const makeSignalingEvent = (sender) => {
  return 'signaling:' + sender
}

/**
 * @returns {String}
 */
export const makeId = () => {
    return nanoid(10)
}