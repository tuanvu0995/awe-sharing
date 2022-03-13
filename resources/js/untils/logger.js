import { toast } from 'react-toastify'

export const logger = (message, { useToast = false, ...data } = {}) => {
  if (Object.keys(data).length) {
    console.log('LOG:', message, data)
  } else {
    console.log('LOG:', message)
  }
  useToast && toast(message)
}
